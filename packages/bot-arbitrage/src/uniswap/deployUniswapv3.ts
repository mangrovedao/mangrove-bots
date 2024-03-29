import { Signer, Contract, ContractFactory, BigNumber } from "ethers";
import WETH9 from "@uniswap/hardhat-v3-deploy/src/util/WETH9.json";
import { linkLibraries } from "./linkLibraries";
import { logger } from "../util/logger";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
  Quoter: require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

export type UniswapV3Contracts = {
  weth9: Contract;
  factory: Contract;
  router: Contract;
  quoter: Contract;
  nftDescriptorLibrary: Contract;
  positionDescriptor: Contract;
  positionManager: Contract;
};

export class UniswapV3Deployer {
  public static async deploy(actor: Signer): Promise<UniswapV3Contracts | {}> {
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
      const quoter = await deployer.deployQuoter(
        factory.address,
        weth9.address
      );
      logger.debug("deployed quoter");
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

      return {
        weth9,
        factory,
        router,
        quoter,
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

  async deployQuoter(factoryAddress: string, weth9Address: string) {
    return this.deployContract<Contract>(
      artifacts.Quoter.abi,
      artifacts.Quoter.bytecode,
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
