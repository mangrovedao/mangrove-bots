import { Signer, Contract, ContractFactory, BigNumber } from "ethers";
import WETH9 from "@uniswap/hardhat-v3-deploy/src/util/WETH9.json";
import { linkLibraries } from "./linkLibraries";
import bn from "bignumber.js";
import { logger } from "../util/logger";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;

export type UniswapV3Contracts = {
  weth9: Contract;
  factory: Contract;
  router: Contract;
  nftDescriptorLibrary: Contract;
  positionDescriptor: Contract;
  positionManager: Contract;
};

export class UniswapV3Deployer {
  public static async deploy(
    actor: Signer,
    token1Address: string,
    token2Address: string,
    poolFee: number
  ): Promise<UniswapV3Contracts | {}> {
    const deployer = new UniswapV3Deployer(actor);

    try {
      // logger.debug("starting deploy");
      const weth9 = await deployer.deployWETH9();
      logger.debug("deployed weth9");
      const factory = await deployer.deployFactory();
      logger.debug("deployed factory");
      const router = await deployer.deployRouter(
        factory.address,
        weth9.address
      );
      logger.debug("deployed router");
      const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary();
      logger.debug("deployed nftDescriptorLibrary");
      const positionDescriptor = await deployer.deployPositionDescriptor(
        nftDescriptorLibrary.address,
        weth9.address
      );
      logger.debug("deployed positionDescriptor");
      const positionManager = await deployer.deployNonfungiblePositionManager(
        factory.address,
        weth9.address,
        positionDescriptor.address
      );
      logger.debug("deployed positionManager");

      const sqrtPrice = encodePriceSqrt(1, 1);
      await positionManager
        .connect(actor)
        .createAndInitializePoolIfNecessary(
          token1Address,
          token2Address,
          poolFee,
          sqrtPrice,
          { gasLimit: 5000000 }
        );

      const poolAddress = await factory
        .connect(actor)
        .getPool(token1Address, token2Address, poolFee);
      logger.debug("poolAddress", poolAddress);

      // const pool = new Contract(
      //   poolAddress,
      //   artifacts.UniswapV3Pool.abi,
      //   actor.provider
      // );
      //
      // logger.debug("------------------");
      // logger.debug("fee", await pool.fee());
      // logger.debug("slot0", await pool.slot0());
      // logger.debug("liquidity", await pool.liquidity());
      // logger.debug("------------------");

      return {
        weth9,
        factory,
        router,
        nftDescriptorLibrary,
        positionDescriptor,
        positionManager,
      };
    } catch (e) {
      console.error(e);
      return Promise.resolve({});
    }
  }

  deployer: Signer;

  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  async deployFactory() {
    return this.deployContract<Contract>(
      artifacts.UniswapV3Factory.abi,
      artifacts.UniswapV3Factory.bytecode,
      [],
      this.deployer
    );
  }

  async deployWETH9() {
    return this.deployContract<Contract>(
      artifacts.WETH9.abi,
      artifacts.WETH9.bytecode,
      [],
      this.deployer
    );
  }

  async deployRouter(factoryAddress: string, weth9Address: string) {
    return this.deployContract<Contract>(
      artifacts.SwapRouter.abi,
      artifacts.SwapRouter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployNFTDescriptorLibrary() {
    return this.deployContract<Contract>(
      artifacts.NFTDescriptor.abi,
      artifacts.NFTDescriptor.bytecode,
      [],
      this.deployer
    );
  }

  async deployPositionDescriptor(
    nftDescriptorLibraryAddress: string,
    weth9Address: string
  ) {
    const linkedBytecode = linkLibraries(
      {
        bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
        linkReferences: {
          "NFTDescriptor.sol": {
            NFTDescriptor: [
              {
                length: 20,
                start: 1681,
              },
            ],
          },
        },
      },
      {
        NFTDescriptor: nftDescriptorLibraryAddress,
      }
    );

    return (await this.deployContract(
      artifacts.NonfungibleTokenPositionDescriptor.abi,
      linkedBytecode,
      [
        weth9Address,
        "0x4554480000000000000000000000000000000000000000000000000000000000",
      ],
      this.deployer
    )) as Contract;
  }

  async deployNonfungiblePositionManager(
    factoryAddress: string,
    weth9Address: string,
    positionDescriptorAddress: string
  ) {
    return this.deployContract<Contract>(
      artifacts.NonfungiblePositionManager.abi,
      artifacts.NonfungiblePositionManager.bytecode,
      [factoryAddress, weth9Address, positionDescriptorAddress],
      this.deployer
    );
  }

  private async deployContract<T>(
    abi: any,
    bytecode: string,
    deployParams: Array<any>,
    actor: Signer
  ) {
    logger.debug(deployParams);
    const factory = new ContractFactory(abi, bytecode, actor);
    const deployment = await factory.deploy(...deployParams);
    const contract = await deployment.deployed();
    logger.debug("deployed contract", contract.address);
    return contract;
  }
}
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
function encodePriceSqrt(reserve1: bn.Value, reserve0: bn.Value) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}
