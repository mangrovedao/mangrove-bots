import { LiquidityProvider, Market, MgvToken, OfferLogic, Semibook } from ".";
import {
  addresses,
  defaultDisplayedDecimals,
  defaultDisplayedPriceDecimals,
  displayedDecimals as loadedDisplayedDecimals,
  displayedPriceDecimals as loadedDisplayedPriceDecimals,
  cashness as loadedCashness,
} from "./constants";
import * as eth from "./eth";
import DevNode from "./util/devNode";
import { Bigish, Provider, Signer, typechain } from "./types";
import { logdataLimiter, logger } from "./util/logger";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ApproveArgs } from "./mgvtoken";

import Big from "big.js";
// Configure big.js global constructor
Big.DP = 20; // precision when dividing
Big.RM = Big.roundHalfUp; // round to nearest

import * as ethers from "ethers";
Big.prototype[Symbol.for("nodejs.util.inspect.custom")] =
  Big.prototype.toString;

/* Prevent directly calling Mangrove constructor
   use Mangrove.connect to make sure the network is reached during construction */
let canConstructMangrove = false;

import type { Awaited } from "ts-essentials";
import UnitCalculations from "./util/unitCalculations";
import {
  BlockManager,
  ReliableProvider,
  ReliableHttpProvider,
  ReliableWebsocketProvider,
} from "@mangrovedao/reliable-event-subscriber";
import { blockManagerOptionsByNetworkName } from "./constants/blockManagerOptions";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { reliableWebSocketOptionsByNetworkName } from "./constants/reliableWebSocketOptions";
import { reliableHttpProviderOptionsByNetworkName } from "./constants/reliableHttpOptions";
import ReaderMultiWrapper from "./util/multi/readerMultiWrapper";
import MangroveEventSubscriber from "./mangroveEventSubscriber";
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Mangrove {
  export type RawConfig = Awaited<
    ReturnType<typechain.Mangrove["functions"]["configInfo"]>
  >;

  export type LocalConfig = {
    active: boolean;
    fee: number;
    density: Big;
    offer_gasbase: number;
    lock: boolean;
    best: number | undefined;
    last: number | undefined;
  };

  export type GlobalConfig = {
    monitor: string;
    useOracle: boolean;
    notify: boolean;
    gasprice: number;
    gasmax: number;
    dead: boolean;
  };

  export type SimplePermitData = {
    outbound_tkn: string;
    inbound_tkn: string;
    owner: string;
    spender: string;
    value: ethers.BigNumber;
    nonce?: number | ethers.BigNumber;
    deadline: number | Date;
  };

  export type PermitData = {
    outbound_tkn: string;
    inbound_tkn: string;
    owner: string;
    spender: string;
    value: ethers.BigNumber;
    nonce: ethers.BigNumber;
    deadline: number;
  };

  export type OpenMarketInfo = {
    base: { address: string; symbol: string; decimals: number };
    quote: { address: string; symbol: string; decimals: number };
    asksConfig: LocalConfig;
    bidsConfig: LocalConfig;
  };

  export type CreateOptions = eth.CreateSignerOptions & {
    blockManagerOptions?: BlockManager.Options;
    reliableWebsocketProviderOptions?: ReliableWebsocketProvider.Options;
    reliableHttpProviderOptions?: ReliableHttpProvider.Options;
  };
}

class Mangrove {
  provider: Provider;
  signer: Signer;
  network: eth.ProviderNetwork;
  _readOnly: boolean;
  address: string;
  contract: typechain.Mangrove;
  readerContract: typechain.MgvReader;
  readerWrappedContract: ReaderMultiWrapper;
  cleanerContract: typechain.MgvCleaner;
  multicallContract: typechain.Multicall2;
  orderContract: typechain.MangroveOrder;
  reliableProvider?: ReliableProvider;
  mangroveEventSubscriber?: MangroveEventSubscriber;

  static devNode: DevNode;
  static typechain = typechain;
  static addresses = addresses;

  /**
   * Creates an instance of the Mangrove Typescript object
   *
   * @param {object} [options] Optional provider options.
   *
   * @example
   * ```
   * const mgv = await require('mangrove.js').connect(options); // web browser
   * ```
   *
   * if options is a string `s`, it is considered to be `{provider:s}`
   * const mgv = await require('mangrove.js').connect('http://127.0.0.1:8545'); // HTTP provider
   *
   * Options:
   * * privateKey: `0x...`
   * * mnemonic: `horse battery ...`
   * * path: `m/44'/60'/0'/...`
   * * provider: url, provider object, or chain string
   *
   * @returns {Mangrove} Returns an instance mangrove.js
   */

  static async connect(
    options?: Mangrove.CreateOptions | string
  ): Promise<Mangrove> {
    if (typeof options === "undefined") {
      options = "http://localhost:8545";
    }
    if (typeof options === "string") {
      options = {
        provider: options,
        providerUrl: options,
      };
    }
    if (typeof options.provider === "string") {
      options.providerUrl = options.provider;
    }
    if (options.provider instanceof JsonRpcProvider && !options.providerUrl) {
      options.providerUrl = options.provider.connection.url; // this is a hack I don't want to spend much time here. Let's discus in PR review
      /*
       * the problem is that Provider interface does not provide a way of getting url, as I
       * implemented our own provider for events, providerUrl becomes mandatory. Should I replace
       * all Mangrove.connect call with the according new interface ?
       * Btw, can't we handle the provider ourself ? does the user really needs to specifiy it's own subscriber ?
       * */
    }

    if (options.signer instanceof ethers.Wallet && !options.providerUrl) {
      if (options.signer.provider instanceof JsonRpcProvider) {
        options.providerUrl = options.signer.provider.connection.url;
      }
    }

    if (!options.providerUrl) {
      throw new Error(
        "Missing providerUrl and could not extract it from signer and provider"
      );
    }

    const { readOnly, signer } = await eth._createSigner(options); // returns a provider equipped signer
    const network = await eth.getProviderNetwork(signer.provider);

    if ("send" in signer.provider) {
      Mangrove.devNode = new DevNode(signer.provider);
      if (await Mangrove.devNode.isDevNode()) {
        await Mangrove.initAndListenToDevNode(Mangrove.devNode);
      }
    }

    if (!options.blockManagerOptions) {
      options.blockManagerOptions =
        blockManagerOptionsByNetworkName[network.name];
    }

    if (!options.blockManagerOptions) {
      throw new Error("Missing block manager option");
    }

    if (!options.reliableWebsocketProviderOptions) {
      const _default = reliableWebSocketOptionsByNetworkName[network.name];
      if (!_default) {
        throw new Error("Missing reliableWebSocketOptions");
      }

      options.reliableWebsocketProviderOptions = {
        wsUrl: options.providerUrl,
        pingIntervalMs: _default.pingIntervalMs,
        pingTimeoutMs: _default.pingTimeoutMs,
      };
    }

    if (!options.reliableHttpProviderOptions) {
      const _default = reliableHttpProviderOptionsByNetworkName[network.name];
      if (!_default) {
        throw new Error("Missing reliableHttpOptions");
      }

      options.reliableHttpProviderOptions = {
        estimatedBlockTimeMs: _default.estimatedBlockTimeMs,
      };
    }
    canConstructMangrove = true;
    const mgv = new Mangrove({
      signer: signer,
      network: network,
      readOnly,
      providerUrl: options.providerUrl,
      blockManagerOptions: options.blockManagerOptions,
      reliableWebSocketProvider: options.reliableWebsocketProviderOptions,
      reliableHttpProvider: options.reliableHttpProviderOptions,
    });

    await mgv.initializeProvider();

    canConstructMangrove = false;

    logger.debug("Initialize Mangrove", {
      contextInfo: "mangrove.base",
      data: logdataLimiter({
        signer: signer,
        network: network,
        readOnly: readOnly,
      }),
    });

    return mgv;
  }

  disconnect(): void {
    this.provider.removeAllListeners();
    if (this.reliableProvider) {
      this.reliableProvider.stop();
    }

    logger.debug("Disconnect from Mangrove", {
      contextInfo: "mangrove.base",
    });
  }
  //TODO types in module namespace with same name as class

  constructor(params: {
    signer: Signer;
    network: eth.ProviderNetwork;
    readOnly: boolean;
    providerUrl?: string;
    blockManagerOptions: BlockManager.Options;
    reliableWebSocketProvider: ReliableWebsocketProvider.Options;
    reliableHttpProvider: ReliableHttpProvider.Options;
  }) {
    if (!canConstructMangrove) {
      throw Error(
        "Mangrove.js must be initialized async with Mangrove.connect (constructors cannot be async)"
      );
    }
    // must always pass a provider-equipped signer
    this.provider = params.signer.provider;
    this.signer = params.signer;
    this.network = params.network;
    this._readOnly = params.readOnly;
    this.multicallContract = typechain.Multicall2__factory.connect(
      Mangrove.getAddress("Multicall2", this.network.name),
      this.signer
    );
    this.address = Mangrove.getAddress("Mangrove", this.network.name);
    this.contract = typechain.Mangrove__factory.connect(
      this.address,
      this.signer
    );
    const readerAddress = Mangrove.getAddress("MgvReader", this.network.name);
    this.readerContract = typechain.MgvReader__factory.connect(
      readerAddress,
      this.signer
    );

    this.readerWrappedContract = new ReaderMultiWrapper(
      this.readerContract,
      this.multicallContract
    );

    const cleanerAddress = Mangrove.getAddress("MgvCleaner", this.network.name);
    this.cleanerContract = typechain.MgvCleaner__factory.connect(
      cleanerAddress,
      this.signer
    );
    const orderAddress = Mangrove.getAddress(
      "MangroveOrder",
      this.network.name
    );
    // this.orderContract = typechain.MangroveOrder__factory.connect(
    this.orderContract = typechain.MangroveOrder__factory.connect(
      orderAddress,
      this.signer
    );

    if (!params.providerUrl) {
      return;
    }

    if (params.providerUrl.startsWith("ws")) {
      this.reliableProvider = new ReliableWebsocketProvider(
        {
          ...params.blockManagerOptions,
          provider: new WebSocketProvider(params.providerUrl),
        },
        params.reliableWebSocketProvider
      );
    } else {
      this.reliableProvider = new ReliableHttpProvider(
        {
          ...params.blockManagerOptions,
          provider: new JsonRpcProvider(params.providerUrl),
        },
        params.reliableHttpProvider
      );
    }

    this.mangroveEventSubscriber = new MangroveEventSubscriber(
      this.provider,
      this.contract,
      this.reliableProvider.blockManager
    );
  }

  /**
   * Initialize reliable provider
   */
  private async initializeProvider(): Promise<void> {
    if (!this.reliableProvider) {
      return;
    }

    logger.debug(`Initialize reliable provider`);
    const block = await this.provider.getBlock("latest");

    await this.reliableProvider.initialize({
      parentHash: block.parentHash,
      hash: block.hash,
      number: block.number,
    });

    await this.mangroveEventSubscriber.enableSubscriptions();
    logger.debug(`Initialized reliable provider done`);
  }
  /* Instance */
  /************** */

  /* Get Market object.
     Argument of the form `{base,quote}` where each is a string.
     To set your own token, use `setDecimals` and `setAddress`.
  */
  async market(params: {
    base: string;
    quote: string;
    bookOptions?: Market.BookOptions;
  }): Promise<Market> {
    logger.debug("Initialize Market", {
      contextInfo: "mangrove.base",
      data: {
        base: params.base,
        quote: params.quote,
        bookOptions: params.bookOptions,
      },
    });
    if (this.reliableProvider && this.reliableProvider.getLatestBlock) {
      await this.reliableProvider.getLatestBlock(); // trigger a quick update to get latest block on market initialization
    }
    return await Market.connect({ ...params, mgv: this });
  }

  /** Get an OfferLogic object allowing one to monitor and set up an onchain offer logic*/
  offerLogic(logic: string): OfferLogic {
    if (ethers.utils.isAddress(logic)) {
      return new OfferLogic(this, logic);
    } else {
      // loading a multi maker predeployed logic
      const address: string = Mangrove.getAddress(logic, this.network.name);
      if (address) {
        return new OfferLogic(this, address);
      } else {
        throw Error(`Cannot find ${logic} on network ${this.network.name}`);
      }
    }
  }

  /** Get a LiquidityProvider object to enable Mangrove's signer to pass buy and sell orders*/
  async liquidityProvider(
    p:
      | Market
      | {
          base: string;
          quote: string;
          bookOptions?: Market.BookOptions;
        }
  ): Promise<LiquidityProvider> {
    const EOA = await this.signer.getAddress();
    if (p instanceof Market) {
      return new LiquidityProvider({
        mgv: this,
        eoa: EOA,
        market: p,
        gasreq: 0,
      });
    } else {
      return new LiquidityProvider({
        mgv: this,
        eoa: EOA,
        market: await this.market(p),
        gasreq: 0,
      });
    }
  }

  /* Return MgvToken instance tied. */
  token(name: string, options?: MgvToken.ConstructorOptions): MgvToken {
    return new MgvToken(name, this, options);
  }

  /**
   * Read a contract address on the current network.
   *
   * Note that this reads from the static `Mangrove` address registry which is shared across instances of this class.
   */
  getAddress(name: string): string {
    return Mangrove.getAddress(name, this.network.name || "mainnet");
  }

  /**
   * Set a contract address on the current network.
   *
   * Note that this writes to the static `Mangrove` address registry which is shared across instances of this class.
   */
  setAddress(name: string, address: string): void {
    Mangrove.setAddress(name, address, this.network.name || "mainnet");
  }

  /**
   * Gets the name of an address on the current network.
   *
   * Note that this reads from the static `Mangrove` address registry which is shared across instances of this class.
   */
  getNameFromAddress(address: string): string {
    const networkAddresses = Mangrove.addresses[this.network.name];

    if (networkAddresses) {
      address = ethers.utils.getAddress(address);

      for (const [name, candidateAddress] of Object.entries(
        networkAddresses
      ) as any) {
        if (candidateAddress == address) {
          return name;
        }
      }
    }
    return null;
  }

  /** Gets the token corresponding to the address if it is known; otherwise, null.
   */
  getTokenAndAddress(address: string) {
    const name = this.getNameFromAddress(address);
    return { address, token: name ? this.token(name) : null };
  }

  /** Convert public token amount to internal token representation.
   *
   * if `nameOrDecimals` is a string, it is interpreted as a token name. Otherwise
   * it is the number of decimals.
   *
   * For convenience, has a static and an instance version.
   *
   *  @example
   *  ```
   *  Mangrove.toUnits(10,"USDC") // 10e6 as ethers.BigNumber
   *  mgv.toUnits(10,6) // 10e6 as ethers.BigNumber
   *  ```
   */
  static toUnits(
    amount: Bigish,
    nameOrDecimals: string | number
  ): ethers.BigNumber {
    return UnitCalculations.toUnits(amount, nameOrDecimals);
  }
  toUnits(amount: Bigish, nameOrDecimals: string | number): ethers.BigNumber {
    return Mangrove.toUnits(amount, nameOrDecimals);
  }

  /** Convert internal token amount to public token representation.
   *
   * if `nameOrDecimals` is a string, it is interpreted as a token name. Otherwise
   * it is the number of decimals.
   *
   *  @example
   *  ```
   *  mgv.fromUnits("1e19","DAI") // 10
   *  mgv.fromUnits("1e19",18) // 10
   *  ```
   */
  fromUnits(
    amount: number | string | ethers.BigNumber,
    nameOrDecimals: string | number
  ): Big {
    return UnitCalculations.fromUnits(amount, nameOrDecimals);
  }

  /** Provision available at mangrove for address given in argument, in ethers */
  async balanceOf(
    address: string,
    overrides: ethers.Overrides = {}
  ): Promise<Big> {
    const bal = await this.contract.balanceOf(address, overrides);
    return this.fromUnits(bal, 18);
  }

  fundMangrove(
    amount: Bigish,
    maker: string,
    overrides: ethers.Overrides = {}
  ): Promise<ethers.ContractTransaction> {
    const _overrides = { value: this.toUnits(amount, 18), ...overrides };
    return this.contract["fund(address)"](maker, _overrides);
  }

  withdraw(
    amount: Bigish,
    overrides: ethers.Overrides = {}
  ): Promise<ethers.ContractTransaction> {
    return this.contract.withdraw(this.toUnits(amount, 18), overrides);
  }

  approveMangrove(
    tokenName: string,
    arg: ApproveArgs = {}
  ): Promise<ethers.ContractTransaction> {
    return this.token(tokenName).approveMangrove(arg);
  }

  /**
   * Return global Mangrove config
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async config(): Promise<Mangrove.GlobalConfig> {
    const config = await this.contract.configInfo(
      ethers.constants.AddressZero,
      ethers.constants.AddressZero
    );
    return {
      monitor: config.global.monitor,
      useOracle: config.global.useOracle,
      notify: config.global.notify,
      gasprice: config.global.gasprice.toNumber(),
      gasmax: config.global.gasmax.toNumber(),
      dead: config.global.dead,
    };
  }

  /** Permit data normalization
   * Autofill/convert 'nonce' field of permit data if needd, convert deadline to
   * num if needed.
   */
  async normalizePermitData(
    params: Mangrove.SimplePermitData
  ): Promise<Mangrove.PermitData> {
    const data = { ...params };

    // Autofind nonce if needed
    if (!("nonce" in data)) {
      data.nonce = await this.contract.nonces(data.owner);
    }

    if (typeof data.nonce === "number") {
      data.nonce = ethers.BigNumber.from(data.nonce);
    }

    // Convert deadline if needed
    if (data.deadline instanceof Date) {
      data.deadline = Math.floor(data.deadline.getTime() / 1000);
    }

    return data as Mangrove.PermitData;
  }

  /**
   * Sign typed data for permit().
   * To set the deadline to +days or +months, you can do
   * let date = new Date();
   * date.setDate(date.getDate() + days);
   * date.setMonth(date.getMonth() + months);
   * - Nonce is autoselected if needed and can be a number
   * - Date can be a Date or a number
   */
  async simpleSignPermitData(params: Mangrove.SimplePermitData) {
    const data = await this.normalizePermitData(params);
    return this.signPermitData(data);
  }

  /** Permit data generator for normalized permit data input */
  async signPermitData(data: Mangrove.PermitData) {
    // Check that generated signer has a typed data signing prop
    if (!("_signTypedData" in this.signer)) {
      throw new Error("Cannot sign typed data with this signer.");
    }

    // Declare domain (match mangrove contract)
    const domain = {
      name: "Mangrove",
      version: "1",
      chainId: this.network.id,
      verifyingContract: this.address,
    };

    // Declare type to sign (match mangrove contract)
    const types = {
      Permit: [
        { name: "outbound_tkn", type: "address" },
        { name: "inbound_tkn", type: "address" },
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const signer = this.signer as unknown as TypedDataSigner;
    return signer._signTypedData(domain, types, data);
  }

  /** Give permit to Mangrove.
   * Permit params.spender to buy on behalf of owner on the outbound/inbound
   * offer list up to value. Default deadline is now + 1 day. Default nonce is
   * current owner nonce.
   */
  async permit(
    params: Mangrove.SimplePermitData
  ): Promise<ethers.ContractTransaction> {
    if (!params.deadline) {
      params.deadline = new Date();
      params.deadline.setDate(params.deadline.getDate() + 1);
    }

    const data = await this.normalizePermitData(params);
    const { v, r, s } = ethers.utils.splitSignature(
      await this.signPermitData(data)
    );

    return this.contract.permit(
      data.outbound_tkn,
      data.inbound_tkn,
      data.owner,
      data.spender,
      data.value,
      data.deadline,
      v,
      r,
      s
    );
  }

  /* Static */
  /********** */

  /**
   * Read all contract addresses on the given network.
   */
  static getAllAddresses(network: string): [string, string][] {
    if (!addresses[network]) {
      throw Error(`No addresses for network ${network}.`);
    }

    return Object.entries(Mangrove.addresses[network]);
  }

  /**
   * Read a contract address on a given network.
   */
  static getAddress(name: string, network: string): string {
    if (!Mangrove.addresses[network]) {
      throw Error(`No addresses for network ${network}.`);
    }

    if (!Mangrove.addresses[network][name]) {
      throw Error(`No address for ${name} on network ${network}.`);
    }

    return Mangrove.addresses[network]?.[name] as string;
  }

  /**
   * Set a contract address on the given network.
   */
  static setAddress(name: string, address: string, network: string): void {
    if (!Mangrove.addresses[network]) {
      Mangrove.addresses[network] = {};
    }
    address = ethers.utils.getAddress(address);
    Mangrove.addresses[network][name] = address;
  }

  /**
   * Read decimals for `tokenName` on given network.
   * To read decimals directly onchain, use `fetchDecimals`.
   */
  static getDecimals(tokenName: string): number {
    return MgvToken.getDecimals(tokenName);
  }

  /**
   * Read displayed decimals for `tokenName`.
   */
  static getDisplayedDecimals(tokenName: string): number {
    return loadedDisplayedDecimals[tokenName] || defaultDisplayedDecimals;
  }

  /**
   * Read displayed decimals for `tokenName` when displayed as a price.
   */
  static getDisplayedPriceDecimals(tokenName: string): number {
    return (
      loadedDisplayedPriceDecimals[tokenName] || defaultDisplayedPriceDecimals
    );
  }

  /**
   * Set decimals for `tokenName` on current network.
   */
  static setDecimals(tokenName: string, dec: number): void {
    MgvToken.setDecimals(tokenName, dec);
  }

  /**
   * Set displayed decimals for `tokenName`.
   */
  static setDisplayedDecimals(tokenName: string, dec: number): void {
    loadedDisplayedDecimals[tokenName] = dec;
  }

  /**
   * Set displayed decimals for `tokenName` when displayed as a price.
   */
  static setDisplayedPriceDecimals(tokenName: string, dec: number): void {
    loadedDisplayedPriceDecimals[tokenName] = dec;
  }

  /**
   * Read chain for decimals of `tokenName` on current network and save them
   */
  static async fetchDecimals(
    tokenName: string,
    provider: Provider
  ): Promise<number> {
    const network = await eth.getProviderNetwork(provider);
    const token = typechain.IERC20__factory.connect(
      Mangrove.getAddress(tokenName, network.name),
      provider
    );
    const decimals = await token.decimals();
    this.setDecimals(tokenName, decimals);
    return decimals;
  }

  /**
   * Setup dev node necessary contracts if needed, register dev Multicall2
   * address, listen to future additions (a script external to mangrove.js may
   * deploy contracts during execution).
   */
  static async initAndListenToDevNode(devNode: DevNode) {
    const network = await eth.getProviderNetwork(devNode.provider);
    // set necessary code
    await devNode.setToyENSCodeIfAbsent();
    await devNode.setMulticallCodeIfAbsent();
    // register Multicall2
    Mangrove.setAddress("Multicall2", devNode.multicallAddress, network.name);
    // get currently deployed contracts & listen for future ones
    const setAddress = (name, address, decimals) => {
      Mangrove.setAddress(name, address, network.name);
      if (typeof decimals !== "undefined") {
        Mangrove.setDecimals(name, decimals);
      }
    };
    const contracts = await devNode.watchAllToyENSEntries(setAddress);
    for (const { name, address, decimals } of contracts) {
      setAddress(name, address, decimals);
    }
  }

  /**
   * Returns open markets data according to mangrove reader.
   * @param from: start at market `from`. Default 0.
   * @param maxLen: max number of markets returned. Default all.
   * @param configs: fetch market's config information. Default true.
   * @param tokenInfo: fetch token information (symbol, decimals)
   * @note If an open market has a token with no/bad decimals/symbol function, this function will revert.
   */
  async openMarketsData(
    params: {
      from?: number;
      maxLen?: number | ethers.BigNumber;
      configs?: boolean;
      tokenInfos?: boolean;
    } = {}
  ): Promise<Mangrove.OpenMarketInfo[]> {
    // set default params
    params.from ??= 0;
    params.maxLen ??= ethers.constants.MaxUint256;
    params.configs ??= true;
    params.tokenInfos ??= true;
    // read open markets and their configs off mgvReader
    const raw = await this.readerContract["openMarkets(uint256,uint256,bool)"](
      params.from,
      params.maxLen,
      params.configs
    );

    // structure data object as address => (symbol,decimals,address=>config)
    const data: Record<
      string,
      { symbol?: string; decimals?: number; configs?: Record<string, any> }
    > = {};
    raw.markets.forEach(([tkn0, tkn1], i) => {
      data[tkn0] ??= { configs: {} };
      data[tkn1] ??= { configs: {} };

      if (params.configs) {
        data[tkn0].configs[tkn1] = raw.configs[i].config01;
        data[tkn1].configs[tkn0] = raw.configs[i].config10;
      }
    });

    const addrs = Object.keys(data);

    //read decimals & symbol for each token using Multicall
    const ierc20 = typechain.IERC20__factory.createInterface();

    const tryDecode = (ary: any[], fnName: "decimals" | "symbol") => {
      return ary.forEach((returnData, i) => {
        // will raise exception if call reverted
        const decoded = ierc20.decodeFunctionResult(
          fnName as any,
          returnData
        )[0];
        data[addrs[i]][fnName as any] = decoded;
      });
    };

    /* Grab decimals for all contracts */
    const decimalArgs = addrs.map((addr) => {
      return { target: addr, callData: ierc20.encodeFunctionData("decimals") };
    });
    const symbolArgs = addrs.map((addr) => {
      return { target: addr, callData: ierc20.encodeFunctionData("symbol") };
    });
    const { returnData } = await this.multicallContract.callStatic.aggregate([
      ...decimalArgs,
      ...symbolArgs,
    ]);
    tryDecode(returnData.slice(0, addrs.length), "decimals");
    tryDecode(returnData.slice(addrs.length), "symbol");

    // format return value
    return raw.markets.map(([tkn0, tkn1]) => {
      const { baseSymbol } = Mangrove.toBaseQuoteByCashness(
        data[tkn0].symbol,
        data[tkn1].symbol
      );
      const [base, quote] =
        baseSymbol === data[tkn0].symbol ? [tkn0, tkn1] : [tkn1, tkn0];

      return {
        base: {
          address: base,
          symbol: data[base].symbol,
          decimals: data[base].decimals,
        },
        quote: {
          address: quote,
          symbol: data[quote].symbol,
          decimals: data[quote].decimals,
        },
        asksConfig: params.configs
          ? Semibook.rawLocalConfigToLocalConfig(
              data[base].configs[quote],
              data[base].decimals
            )
          : undefined,
        bidsConfig: params.configs
          ? Semibook.rawLocalConfigToLocalConfig(
              data[quote].configs[base],
              data[quote].decimals
            )
          : undefined,
      };
    });
  }

  /**
   * Returns open markets according to mangrove reader. Will internally update Mangrove token information.
   *
   * @param from: start at market `from` (default: 0)
   * @param maxLen: max number of markets returned (default: all)
   * @param noInit: do not initialize markets (default: false)
   * @param bookOptions: bookOptions argument to pass to every new market (default: undefined)
   */
  async openMarkets(
    params: {
      from?: number;
      maxLen?: number;
      noInit?: boolean;
      bookOptions?: Market.BookOptions;
    } = {}
  ): Promise<Market[]> {
    const noInit = params.noInit ?? false;
    delete params.noInit;
    const bookOptions = params.bookOptions;
    delete params.bookOptions;
    const openMarketsData = await this.openMarketsData({
      ...params,
      tokenInfos: true,
      configs: false,
    });
    // TODO: fetch all semibook configs in one Multicall and dispatch to Semibook initializations (see openMarketsData) instead of firing multiple RPC calls.
    return Promise.all(
      openMarketsData.map(({ base, quote }) => {
        this.token(base.symbol, {
          address: base.address,
          decimals: base.decimals,
        });
        this.token(quote.symbol, {
          address: quote.address,
          decimals: quote.decimals,
        });
        return Market.connect({
          mgv: this,
          base: base.symbol,
          quote: quote.symbol,
          bookOptions: bookOptions,
          noInit: noInit,
        });
      })
    );
  }

  // relative cashness of a token will determine which is base & which is quote
  // lower cashness is base, higher cashness is quote, tiebreaker is lexicographic ordering of symbol string
  setCashness(symbol: string, cashness: number) {
    loadedCashness[symbol] = cashness;
  }

  // cashness is "how similar to cash is a token". The cashier token is the quote.
  // toBaseQuoteByCashness orders symbols according to relative cashness.
  // Assume cashness of both to be 0 if cashness is undefined for at least one argument.
  // Ordering is lex order on cashness x (string order)
  static toBaseQuoteByCashness(symbol0: string, symbol1: string) {
    let cash0 = 0;
    let cash1 = 0;
    if (symbol0 in loadedCashness && symbol1 in loadedCashness) {
      cash0 = loadedCashness[symbol0];
      cash1 = loadedCashness[symbol1];
    }
    if (cash0 < cash1 || (cash0 === cash1 && symbol0 < symbol1)) {
      return { baseSymbol: symbol0, quoteSymbol: symbol1 };
    } else {
      return { baseSymbol: symbol1, quoteSymbol: symbol0 };
    }
  }
}

export default Mangrove;
