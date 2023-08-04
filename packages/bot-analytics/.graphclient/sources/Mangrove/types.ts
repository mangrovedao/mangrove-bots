// @ts-nocheck

import { InContextSdkMethod } from "@graphql-mesh/types";
import { MeshContext } from "@graphql-mesh/runtime";

export namespace MangroveTypes {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
  };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
  };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigDecimal: any;
    BigInt: any;
    Bytes: any;
  };

  export type Account = {
    id: Scalars["Bytes"];
    address: Scalars["Bytes"];
    creationDate: Scalars["BigInt"];
    latestInteractionDate: Scalars["BigInt"];
    volumes: Array<AccountVolumeByPair>;
  };

  export type AccountvolumesArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<AccountVolumeByPair_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<AccountVolumeByPair_filter>;
  };

  export type AccountVolumeByPair = {
    id: Scalars["String"];
    account: Account;
    updatedDate: Scalars["BigInt"];
    token0: Scalars["Bytes"];
    token1: Scalars["Bytes"];
    token0Sent: Scalars["BigInt"];
    token0Received: Scalars["BigInt"];
    token1Sent: Scalars["BigInt"];
    token1Received: Scalars["BigInt"];
  };

  export type AccountVolumeByPair_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    account?: InputMaybe<Scalars["String"]>;
    account_not?: InputMaybe<Scalars["String"]>;
    account_gt?: InputMaybe<Scalars["String"]>;
    account_lt?: InputMaybe<Scalars["String"]>;
    account_gte?: InputMaybe<Scalars["String"]>;
    account_lte?: InputMaybe<Scalars["String"]>;
    account_in?: InputMaybe<Array<Scalars["String"]>>;
    account_not_in?: InputMaybe<Array<Scalars["String"]>>;
    account_contains?: InputMaybe<Scalars["String"]>;
    account_contains_nocase?: InputMaybe<Scalars["String"]>;
    account_not_contains?: InputMaybe<Scalars["String"]>;
    account_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    account_starts_with?: InputMaybe<Scalars["String"]>;
    account_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    account_not_starts_with?: InputMaybe<Scalars["String"]>;
    account_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    account_ends_with?: InputMaybe<Scalars["String"]>;
    account_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    account_not_ends_with?: InputMaybe<Scalars["String"]>;
    account_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    account_?: InputMaybe<Account_filter>;
    updatedDate?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_not?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_gt?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_lt?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_gte?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_lte?: InputMaybe<Scalars["BigInt"]>;
    updatedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    updatedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token0?: InputMaybe<Scalars["Bytes"]>;
    token0_not?: InputMaybe<Scalars["Bytes"]>;
    token0_gt?: InputMaybe<Scalars["Bytes"]>;
    token0_lt?: InputMaybe<Scalars["Bytes"]>;
    token0_gte?: InputMaybe<Scalars["Bytes"]>;
    token0_lte?: InputMaybe<Scalars["Bytes"]>;
    token0_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token0_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token0_contains?: InputMaybe<Scalars["Bytes"]>;
    token0_not_contains?: InputMaybe<Scalars["Bytes"]>;
    token1?: InputMaybe<Scalars["Bytes"]>;
    token1_not?: InputMaybe<Scalars["Bytes"]>;
    token1_gt?: InputMaybe<Scalars["Bytes"]>;
    token1_lt?: InputMaybe<Scalars["Bytes"]>;
    token1_gte?: InputMaybe<Scalars["Bytes"]>;
    token1_lte?: InputMaybe<Scalars["Bytes"]>;
    token1_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token1_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token1_contains?: InputMaybe<Scalars["Bytes"]>;
    token1_not_contains?: InputMaybe<Scalars["Bytes"]>;
    token0Sent?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_not?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_gt?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_lt?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_gte?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_lte?: InputMaybe<Scalars["BigInt"]>;
    token0Sent_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token0Sent_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token0Received?: InputMaybe<Scalars["BigInt"]>;
    token0Received_not?: InputMaybe<Scalars["BigInt"]>;
    token0Received_gt?: InputMaybe<Scalars["BigInt"]>;
    token0Received_lt?: InputMaybe<Scalars["BigInt"]>;
    token0Received_gte?: InputMaybe<Scalars["BigInt"]>;
    token0Received_lte?: InputMaybe<Scalars["BigInt"]>;
    token0Received_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token0Received_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token1Sent?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_not?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_gt?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_lt?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_gte?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_lte?: InputMaybe<Scalars["BigInt"]>;
    token1Sent_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token1Sent_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token1Received?: InputMaybe<Scalars["BigInt"]>;
    token1Received_not?: InputMaybe<Scalars["BigInt"]>;
    token1Received_gt?: InputMaybe<Scalars["BigInt"]>;
    token1Received_lt?: InputMaybe<Scalars["BigInt"]>;
    token1Received_gte?: InputMaybe<Scalars["BigInt"]>;
    token1Received_lte?: InputMaybe<Scalars["BigInt"]>;
    token1Received_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token1Received_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<AccountVolumeByPair_filter>>>;
    or?: InputMaybe<Array<InputMaybe<AccountVolumeByPair_filter>>>;
  };

  export type AccountVolumeByPair_orderBy =
    | "id"
    | "account"
    | "account__id"
    | "account__address"
    | "account__creationDate"
    | "account__latestInteractionDate"
    | "updatedDate"
    | "token0"
    | "token1"
    | "token0Sent"
    | "token0Received"
    | "token1Sent"
    | "token1Received";

  export type Account_filter = {
    id?: InputMaybe<Scalars["Bytes"]>;
    id_not?: InputMaybe<Scalars["Bytes"]>;
    id_gt?: InputMaybe<Scalars["Bytes"]>;
    id_lt?: InputMaybe<Scalars["Bytes"]>;
    id_gte?: InputMaybe<Scalars["Bytes"]>;
    id_lte?: InputMaybe<Scalars["Bytes"]>;
    id_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    id_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    id_contains?: InputMaybe<Scalars["Bytes"]>;
    id_not_contains?: InputMaybe<Scalars["Bytes"]>;
    address?: InputMaybe<Scalars["Bytes"]>;
    address_not?: InputMaybe<Scalars["Bytes"]>;
    address_gt?: InputMaybe<Scalars["Bytes"]>;
    address_lt?: InputMaybe<Scalars["Bytes"]>;
    address_gte?: InputMaybe<Scalars["Bytes"]>;
    address_lte?: InputMaybe<Scalars["Bytes"]>;
    address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    address_contains?: InputMaybe<Scalars["Bytes"]>;
    address_not_contains?: InputMaybe<Scalars["Bytes"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestInteractionDate?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_not?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_gt?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_lt?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_gte?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_lte?: InputMaybe<Scalars["BigInt"]>;
    latestInteractionDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestInteractionDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    volumes_?: InputMaybe<AccountVolumeByPair_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Account_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Account_filter>>>;
  };

  export type Account_orderBy =
    | "id"
    | "address"
    | "creationDate"
    | "latestInteractionDate"
    | "volumes";

  export type BlockChangedFilter = {
    number_gte: Scalars["Int"];
  };

  export type Block_height = {
    hash?: InputMaybe<Scalars["Bytes"]>;
    number?: InputMaybe<Scalars["Int"]>;
    number_gte?: InputMaybe<Scalars["Int"]>;
  };

  export type Kandel = {
    id: Scalars["Bytes"];
    transactionHash: Scalars["Bytes"];
    creationDate: Scalars["BigInt"];
    seeder: Scalars["Bytes"];
    address: Scalars["Bytes"];
    base: Scalars["Bytes"];
    quote: Scalars["Bytes"];
    deployer: Account;
    admin: Account;
    reserveId?: Maybe<Scalars["Bytes"]>;
    router?: Maybe<Scalars["Bytes"]>;
    depositedBase: Scalars["BigInt"];
    depositedQuote: Scalars["BigInt"];
    gasprice?: Maybe<Scalars["BigInt"]>;
    gasreq?: Maybe<Scalars["BigInt"]>;
    compoundRateBase?: Maybe<Scalars["BigInt"]>;
    compoundRateQuote?: Maybe<Scalars["BigInt"]>;
    spread?: Maybe<Scalars["BigInt"]>;
    ratio?: Maybe<Scalars["BigInt"]>;
    length?: Maybe<Scalars["BigInt"]>;
    offerIndexes: Array<Scalars["String"]>;
    offers: Array<Offer>;
    depositWithdraws: Array<KandelDepositWithdraw>;
    parameters: Array<KandelParameters>;
  };

  export type KandeloffersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Offer_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Offer_filter>;
  };

  export type KandeldepositWithdrawsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelDepositWithdraw_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelDepositWithdraw_filter>;
  };

  export type KandelparametersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelParameters_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelParameters_filter>;
  };

  export type KandelDepositWithdraw = {
    id: Scalars["String"];
    transactionHash: Scalars["Bytes"];
    date: Scalars["BigInt"];
    token: Scalars["Bytes"];
    amount: Scalars["BigInt"];
    isDeposit: Scalars["Boolean"];
    kandel: Kandel;
  };

  export type KandelDepositWithdraw_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    transactionHash?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    date?: InputMaybe<Scalars["BigInt"]>;
    date_not?: InputMaybe<Scalars["BigInt"]>;
    date_gt?: InputMaybe<Scalars["BigInt"]>;
    date_lt?: InputMaybe<Scalars["BigInt"]>;
    date_gte?: InputMaybe<Scalars["BigInt"]>;
    date_lte?: InputMaybe<Scalars["BigInt"]>;
    date_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    date_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    token?: InputMaybe<Scalars["Bytes"]>;
    token_not?: InputMaybe<Scalars["Bytes"]>;
    token_gt?: InputMaybe<Scalars["Bytes"]>;
    token_lt?: InputMaybe<Scalars["Bytes"]>;
    token_gte?: InputMaybe<Scalars["Bytes"]>;
    token_lte?: InputMaybe<Scalars["Bytes"]>;
    token_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    token_contains?: InputMaybe<Scalars["Bytes"]>;
    token_not_contains?: InputMaybe<Scalars["Bytes"]>;
    amount?: InputMaybe<Scalars["BigInt"]>;
    amount_not?: InputMaybe<Scalars["BigInt"]>;
    amount_gt?: InputMaybe<Scalars["BigInt"]>;
    amount_lt?: InputMaybe<Scalars["BigInt"]>;
    amount_gte?: InputMaybe<Scalars["BigInt"]>;
    amount_lte?: InputMaybe<Scalars["BigInt"]>;
    amount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    amount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    isDeposit?: InputMaybe<Scalars["Boolean"]>;
    isDeposit_not?: InputMaybe<Scalars["Boolean"]>;
    isDeposit_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isDeposit_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    kandel?: InputMaybe<Scalars["String"]>;
    kandel_not?: InputMaybe<Scalars["String"]>;
    kandel_gt?: InputMaybe<Scalars["String"]>;
    kandel_lt?: InputMaybe<Scalars["String"]>;
    kandel_gte?: InputMaybe<Scalars["String"]>;
    kandel_lte?: InputMaybe<Scalars["String"]>;
    kandel_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_not_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_contains?: InputMaybe<Scalars["String"]>;
    kandel_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_contains?: InputMaybe<Scalars["String"]>;
    kandel_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_?: InputMaybe<Kandel_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<KandelDepositWithdraw_filter>>>;
    or?: InputMaybe<Array<InputMaybe<KandelDepositWithdraw_filter>>>;
  };

  export type KandelDepositWithdraw_orderBy =
    | "id"
    | "transactionHash"
    | "date"
    | "token"
    | "amount"
    | "isDeposit"
    | "kandel"
    | "kandel__id"
    | "kandel__transactionHash"
    | "kandel__creationDate"
    | "kandel__seeder"
    | "kandel__address"
    | "kandel__base"
    | "kandel__quote"
    | "kandel__reserveId"
    | "kandel__router"
    | "kandel__depositedBase"
    | "kandel__depositedQuote"
    | "kandel__gasprice"
    | "kandel__gasreq"
    | "kandel__compoundRateBase"
    | "kandel__compoundRateQuote"
    | "kandel__spread"
    | "kandel__ratio"
    | "kandel__length";

  export type KandelParameters = {
    id: Scalars["String"];
    transactionHash: Scalars["Bytes"];
    creationDate: Scalars["BigInt"];
    gasprice?: Maybe<Scalars["BigInt"]>;
    gasreq?: Maybe<Scalars["BigInt"]>;
    compoundRateBase?: Maybe<Scalars["BigInt"]>;
    compoundRateQuote?: Maybe<Scalars["BigInt"]>;
    spread?: Maybe<Scalars["BigInt"]>;
    ratio?: Maybe<Scalars["BigInt"]>;
    length?: Maybe<Scalars["BigInt"]>;
    kandel: Kandel;
  };

  export type KandelParameters_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    transactionHash?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice?: InputMaybe<Scalars["BigInt"]>;
    gasprice_not?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq?: InputMaybe<Scalars["BigInt"]>;
    gasreq_not?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateBase?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_not?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_gt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_lt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_gte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_lte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateBase_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateQuote?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_not?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_gt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_lt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_gte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_lte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateQuote_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    spread?: InputMaybe<Scalars["BigInt"]>;
    spread_not?: InputMaybe<Scalars["BigInt"]>;
    spread_gt?: InputMaybe<Scalars["BigInt"]>;
    spread_lt?: InputMaybe<Scalars["BigInt"]>;
    spread_gte?: InputMaybe<Scalars["BigInt"]>;
    spread_lte?: InputMaybe<Scalars["BigInt"]>;
    spread_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    spread_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    ratio?: InputMaybe<Scalars["BigInt"]>;
    ratio_not?: InputMaybe<Scalars["BigInt"]>;
    ratio_gt?: InputMaybe<Scalars["BigInt"]>;
    ratio_lt?: InputMaybe<Scalars["BigInt"]>;
    ratio_gte?: InputMaybe<Scalars["BigInt"]>;
    ratio_lte?: InputMaybe<Scalars["BigInt"]>;
    ratio_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    ratio_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    length?: InputMaybe<Scalars["BigInt"]>;
    length_not?: InputMaybe<Scalars["BigInt"]>;
    length_gt?: InputMaybe<Scalars["BigInt"]>;
    length_lt?: InputMaybe<Scalars["BigInt"]>;
    length_gte?: InputMaybe<Scalars["BigInt"]>;
    length_lte?: InputMaybe<Scalars["BigInt"]>;
    length_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    length_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    kandel?: InputMaybe<Scalars["String"]>;
    kandel_not?: InputMaybe<Scalars["String"]>;
    kandel_gt?: InputMaybe<Scalars["String"]>;
    kandel_lt?: InputMaybe<Scalars["String"]>;
    kandel_gte?: InputMaybe<Scalars["String"]>;
    kandel_lte?: InputMaybe<Scalars["String"]>;
    kandel_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_not_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_contains?: InputMaybe<Scalars["String"]>;
    kandel_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_contains?: InputMaybe<Scalars["String"]>;
    kandel_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_?: InputMaybe<Kandel_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<KandelParameters_filter>>>;
    or?: InputMaybe<Array<InputMaybe<KandelParameters_filter>>>;
  };

  export type KandelParameters_orderBy =
    | "id"
    | "transactionHash"
    | "creationDate"
    | "gasprice"
    | "gasreq"
    | "compoundRateBase"
    | "compoundRateQuote"
    | "spread"
    | "ratio"
    | "length"
    | "kandel"
    | "kandel__id"
    | "kandel__transactionHash"
    | "kandel__creationDate"
    | "kandel__seeder"
    | "kandel__address"
    | "kandel__base"
    | "kandel__quote"
    | "kandel__reserveId"
    | "kandel__router"
    | "kandel__depositedBase"
    | "kandel__depositedQuote"
    | "kandel__gasprice"
    | "kandel__gasreq"
    | "kandel__compoundRateBase"
    | "kandel__compoundRateQuote"
    | "kandel__spread"
    | "kandel__ratio"
    | "kandel__length";

  export type KandelPopulateRetract = {
    id: Scalars["String"];
    transactionHash: Scalars["Bytes"];
    creationDate: Scalars["BigInt"];
    startLogIndex: Scalars["BigInt"];
    isRetract: Scalars["Boolean"];
    offerGives: Array<Scalars["String"]>;
    kandel: Kandel;
  };

  export type KandelPopulateRetract_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    transactionHash?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    startLogIndex?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_not?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_gt?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_lt?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_gte?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_lte?: InputMaybe<Scalars["BigInt"]>;
    startLogIndex_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    startLogIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    isRetract?: InputMaybe<Scalars["Boolean"]>;
    isRetract_not?: InputMaybe<Scalars["Boolean"]>;
    isRetract_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isRetract_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    offerGives?: InputMaybe<Array<Scalars["String"]>>;
    offerGives_not?: InputMaybe<Array<Scalars["String"]>>;
    offerGives_contains?: InputMaybe<Array<Scalars["String"]>>;
    offerGives_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
    offerGives_not_contains?: InputMaybe<Array<Scalars["String"]>>;
    offerGives_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
    kandel?: InputMaybe<Scalars["String"]>;
    kandel_not?: InputMaybe<Scalars["String"]>;
    kandel_gt?: InputMaybe<Scalars["String"]>;
    kandel_lt?: InputMaybe<Scalars["String"]>;
    kandel_gte?: InputMaybe<Scalars["String"]>;
    kandel_lte?: InputMaybe<Scalars["String"]>;
    kandel_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_not_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_contains?: InputMaybe<Scalars["String"]>;
    kandel_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_contains?: InputMaybe<Scalars["String"]>;
    kandel_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_?: InputMaybe<Kandel_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<KandelPopulateRetract_filter>>>;
    or?: InputMaybe<Array<InputMaybe<KandelPopulateRetract_filter>>>;
  };

  export type KandelPopulateRetract_orderBy =
    | "id"
    | "transactionHash"
    | "creationDate"
    | "startLogIndex"
    | "isRetract"
    | "offerGives"
    | "kandel"
    | "kandel__id"
    | "kandel__transactionHash"
    | "kandel__creationDate"
    | "kandel__seeder"
    | "kandel__address"
    | "kandel__base"
    | "kandel__quote"
    | "kandel__reserveId"
    | "kandel__router"
    | "kandel__depositedBase"
    | "kandel__depositedQuote"
    | "kandel__gasprice"
    | "kandel__gasreq"
    | "kandel__compoundRateBase"
    | "kandel__compoundRateQuote"
    | "kandel__spread"
    | "kandel__ratio"
    | "kandel__length";

  export type Kandel_filter = {
    id?: InputMaybe<Scalars["Bytes"]>;
    id_not?: InputMaybe<Scalars["Bytes"]>;
    id_gt?: InputMaybe<Scalars["Bytes"]>;
    id_lt?: InputMaybe<Scalars["Bytes"]>;
    id_gte?: InputMaybe<Scalars["Bytes"]>;
    id_lte?: InputMaybe<Scalars["Bytes"]>;
    id_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    id_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    id_contains?: InputMaybe<Scalars["Bytes"]>;
    id_not_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    seeder?: InputMaybe<Scalars["Bytes"]>;
    seeder_not?: InputMaybe<Scalars["Bytes"]>;
    seeder_gt?: InputMaybe<Scalars["Bytes"]>;
    seeder_lt?: InputMaybe<Scalars["Bytes"]>;
    seeder_gte?: InputMaybe<Scalars["Bytes"]>;
    seeder_lte?: InputMaybe<Scalars["Bytes"]>;
    seeder_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    seeder_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    seeder_contains?: InputMaybe<Scalars["Bytes"]>;
    seeder_not_contains?: InputMaybe<Scalars["Bytes"]>;
    address?: InputMaybe<Scalars["Bytes"]>;
    address_not?: InputMaybe<Scalars["Bytes"]>;
    address_gt?: InputMaybe<Scalars["Bytes"]>;
    address_lt?: InputMaybe<Scalars["Bytes"]>;
    address_gte?: InputMaybe<Scalars["Bytes"]>;
    address_lte?: InputMaybe<Scalars["Bytes"]>;
    address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    address_contains?: InputMaybe<Scalars["Bytes"]>;
    address_not_contains?: InputMaybe<Scalars["Bytes"]>;
    base?: InputMaybe<Scalars["Bytes"]>;
    base_not?: InputMaybe<Scalars["Bytes"]>;
    base_gt?: InputMaybe<Scalars["Bytes"]>;
    base_lt?: InputMaybe<Scalars["Bytes"]>;
    base_gte?: InputMaybe<Scalars["Bytes"]>;
    base_lte?: InputMaybe<Scalars["Bytes"]>;
    base_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    base_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    base_contains?: InputMaybe<Scalars["Bytes"]>;
    base_not_contains?: InputMaybe<Scalars["Bytes"]>;
    quote?: InputMaybe<Scalars["Bytes"]>;
    quote_not?: InputMaybe<Scalars["Bytes"]>;
    quote_gt?: InputMaybe<Scalars["Bytes"]>;
    quote_lt?: InputMaybe<Scalars["Bytes"]>;
    quote_gte?: InputMaybe<Scalars["Bytes"]>;
    quote_lte?: InputMaybe<Scalars["Bytes"]>;
    quote_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    quote_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    quote_contains?: InputMaybe<Scalars["Bytes"]>;
    quote_not_contains?: InputMaybe<Scalars["Bytes"]>;
    deployer?: InputMaybe<Scalars["String"]>;
    deployer_not?: InputMaybe<Scalars["String"]>;
    deployer_gt?: InputMaybe<Scalars["String"]>;
    deployer_lt?: InputMaybe<Scalars["String"]>;
    deployer_gte?: InputMaybe<Scalars["String"]>;
    deployer_lte?: InputMaybe<Scalars["String"]>;
    deployer_in?: InputMaybe<Array<Scalars["String"]>>;
    deployer_not_in?: InputMaybe<Array<Scalars["String"]>>;
    deployer_contains?: InputMaybe<Scalars["String"]>;
    deployer_contains_nocase?: InputMaybe<Scalars["String"]>;
    deployer_not_contains?: InputMaybe<Scalars["String"]>;
    deployer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    deployer_starts_with?: InputMaybe<Scalars["String"]>;
    deployer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    deployer_not_starts_with?: InputMaybe<Scalars["String"]>;
    deployer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    deployer_ends_with?: InputMaybe<Scalars["String"]>;
    deployer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    deployer_not_ends_with?: InputMaybe<Scalars["String"]>;
    deployer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    deployer_?: InputMaybe<Account_filter>;
    admin?: InputMaybe<Scalars["String"]>;
    admin_not?: InputMaybe<Scalars["String"]>;
    admin_gt?: InputMaybe<Scalars["String"]>;
    admin_lt?: InputMaybe<Scalars["String"]>;
    admin_gte?: InputMaybe<Scalars["String"]>;
    admin_lte?: InputMaybe<Scalars["String"]>;
    admin_in?: InputMaybe<Array<Scalars["String"]>>;
    admin_not_in?: InputMaybe<Array<Scalars["String"]>>;
    admin_contains?: InputMaybe<Scalars["String"]>;
    admin_contains_nocase?: InputMaybe<Scalars["String"]>;
    admin_not_contains?: InputMaybe<Scalars["String"]>;
    admin_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    admin_starts_with?: InputMaybe<Scalars["String"]>;
    admin_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    admin_not_starts_with?: InputMaybe<Scalars["String"]>;
    admin_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    admin_ends_with?: InputMaybe<Scalars["String"]>;
    admin_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    admin_not_ends_with?: InputMaybe<Scalars["String"]>;
    admin_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    admin_?: InputMaybe<Account_filter>;
    reserveId?: InputMaybe<Scalars["Bytes"]>;
    reserveId_not?: InputMaybe<Scalars["Bytes"]>;
    reserveId_gt?: InputMaybe<Scalars["Bytes"]>;
    reserveId_lt?: InputMaybe<Scalars["Bytes"]>;
    reserveId_gte?: InputMaybe<Scalars["Bytes"]>;
    reserveId_lte?: InputMaybe<Scalars["Bytes"]>;
    reserveId_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    reserveId_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    reserveId_contains?: InputMaybe<Scalars["Bytes"]>;
    reserveId_not_contains?: InputMaybe<Scalars["Bytes"]>;
    router?: InputMaybe<Scalars["Bytes"]>;
    router_not?: InputMaybe<Scalars["Bytes"]>;
    router_gt?: InputMaybe<Scalars["Bytes"]>;
    router_lt?: InputMaybe<Scalars["Bytes"]>;
    router_gte?: InputMaybe<Scalars["Bytes"]>;
    router_lte?: InputMaybe<Scalars["Bytes"]>;
    router_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    router_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    router_contains?: InputMaybe<Scalars["Bytes"]>;
    router_not_contains?: InputMaybe<Scalars["Bytes"]>;
    depositedBase?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_not?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_gt?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_lt?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_gte?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_lte?: InputMaybe<Scalars["BigInt"]>;
    depositedBase_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    depositedBase_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    depositedQuote?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_not?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_gt?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_lt?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_gte?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_lte?: InputMaybe<Scalars["BigInt"]>;
    depositedQuote_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    depositedQuote_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice?: InputMaybe<Scalars["BigInt"]>;
    gasprice_not?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq?: InputMaybe<Scalars["BigInt"]>;
    gasreq_not?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateBase?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_not?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_gt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_lt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_gte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_lte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateBase_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateBase_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateQuote?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_not?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_gt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_lt?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_gte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_lte?: InputMaybe<Scalars["BigInt"]>;
    compoundRateQuote_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    compoundRateQuote_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    spread?: InputMaybe<Scalars["BigInt"]>;
    spread_not?: InputMaybe<Scalars["BigInt"]>;
    spread_gt?: InputMaybe<Scalars["BigInt"]>;
    spread_lt?: InputMaybe<Scalars["BigInt"]>;
    spread_gte?: InputMaybe<Scalars["BigInt"]>;
    spread_lte?: InputMaybe<Scalars["BigInt"]>;
    spread_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    spread_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    ratio?: InputMaybe<Scalars["BigInt"]>;
    ratio_not?: InputMaybe<Scalars["BigInt"]>;
    ratio_gt?: InputMaybe<Scalars["BigInt"]>;
    ratio_lt?: InputMaybe<Scalars["BigInt"]>;
    ratio_gte?: InputMaybe<Scalars["BigInt"]>;
    ratio_lte?: InputMaybe<Scalars["BigInt"]>;
    ratio_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    ratio_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    length?: InputMaybe<Scalars["BigInt"]>;
    length_not?: InputMaybe<Scalars["BigInt"]>;
    length_gt?: InputMaybe<Scalars["BigInt"]>;
    length_lt?: InputMaybe<Scalars["BigInt"]>;
    length_gte?: InputMaybe<Scalars["BigInt"]>;
    length_lte?: InputMaybe<Scalars["BigInt"]>;
    length_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    length_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    offerIndexes?: InputMaybe<Array<Scalars["String"]>>;
    offerIndexes_not?: InputMaybe<Array<Scalars["String"]>>;
    offerIndexes_contains?: InputMaybe<Array<Scalars["String"]>>;
    offerIndexes_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
    offerIndexes_not_contains?: InputMaybe<Array<Scalars["String"]>>;
    offerIndexes_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
    offers_?: InputMaybe<Offer_filter>;
    depositWithdraws_?: InputMaybe<KandelDepositWithdraw_filter>;
    parameters_?: InputMaybe<KandelParameters_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Kandel_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Kandel_filter>>>;
  };

  export type Kandel_orderBy =
    | "id"
    | "transactionHash"
    | "creationDate"
    | "seeder"
    | "address"
    | "base"
    | "quote"
    | "deployer"
    | "deployer__id"
    | "deployer__address"
    | "deployer__creationDate"
    | "deployer__latestInteractionDate"
    | "admin"
    | "admin__id"
    | "admin__address"
    | "admin__creationDate"
    | "admin__latestInteractionDate"
    | "reserveId"
    | "router"
    | "depositedBase"
    | "depositedQuote"
    | "gasprice"
    | "gasreq"
    | "compoundRateBase"
    | "compoundRateQuote"
    | "spread"
    | "ratio"
    | "length"
    | "offerIndexes"
    | "offers"
    | "depositWithdraws"
    | "parameters";

  export type LimitOrder = {
    id: Scalars["String"];
    creationDate: Scalars["BigInt"];
    latestUpdateDate: Scalars["BigInt"];
    wants: Scalars["BigInt"];
    gives: Scalars["BigInt"];
    expiryDate?: Maybe<Scalars["BigInt"]>;
    fillWants: Scalars["Boolean"];
    fillOrKill: Scalars["Boolean"];
    restingOrder: Scalars["Boolean"];
    realTaker?: Maybe<Account>;
    offer?: Maybe<Offer>;
    isOpen?: Maybe<Scalars["Boolean"]>;
    order: Order;
  };

  export type LimitOrder_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestUpdateDate?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_not?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_gt?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_lt?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_gte?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_lte?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestUpdateDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    wants?: InputMaybe<Scalars["BigInt"]>;
    wants_not?: InputMaybe<Scalars["BigInt"]>;
    wants_gt?: InputMaybe<Scalars["BigInt"]>;
    wants_lt?: InputMaybe<Scalars["BigInt"]>;
    wants_gte?: InputMaybe<Scalars["BigInt"]>;
    wants_lte?: InputMaybe<Scalars["BigInt"]>;
    wants_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    wants_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gives?: InputMaybe<Scalars["BigInt"]>;
    gives_not?: InputMaybe<Scalars["BigInt"]>;
    gives_gt?: InputMaybe<Scalars["BigInt"]>;
    gives_lt?: InputMaybe<Scalars["BigInt"]>;
    gives_gte?: InputMaybe<Scalars["BigInt"]>;
    gives_lte?: InputMaybe<Scalars["BigInt"]>;
    gives_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gives_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    expiryDate?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_not?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_gt?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_lt?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_gte?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_lte?: InputMaybe<Scalars["BigInt"]>;
    expiryDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    expiryDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    fillWants?: InputMaybe<Scalars["Boolean"]>;
    fillWants_not?: InputMaybe<Scalars["Boolean"]>;
    fillWants_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    fillWants_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    fillOrKill?: InputMaybe<Scalars["Boolean"]>;
    fillOrKill_not?: InputMaybe<Scalars["Boolean"]>;
    fillOrKill_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    fillOrKill_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    restingOrder?: InputMaybe<Scalars["Boolean"]>;
    restingOrder_not?: InputMaybe<Scalars["Boolean"]>;
    restingOrder_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    restingOrder_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    realTaker?: InputMaybe<Scalars["String"]>;
    realTaker_not?: InputMaybe<Scalars["String"]>;
    realTaker_gt?: InputMaybe<Scalars["String"]>;
    realTaker_lt?: InputMaybe<Scalars["String"]>;
    realTaker_gte?: InputMaybe<Scalars["String"]>;
    realTaker_lte?: InputMaybe<Scalars["String"]>;
    realTaker_in?: InputMaybe<Array<Scalars["String"]>>;
    realTaker_not_in?: InputMaybe<Array<Scalars["String"]>>;
    realTaker_contains?: InputMaybe<Scalars["String"]>;
    realTaker_contains_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_not_contains?: InputMaybe<Scalars["String"]>;
    realTaker_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_starts_with?: InputMaybe<Scalars["String"]>;
    realTaker_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_not_starts_with?: InputMaybe<Scalars["String"]>;
    realTaker_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_ends_with?: InputMaybe<Scalars["String"]>;
    realTaker_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_not_ends_with?: InputMaybe<Scalars["String"]>;
    realTaker_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    realTaker_?: InputMaybe<Account_filter>;
    offer?: InputMaybe<Scalars["String"]>;
    offer_not?: InputMaybe<Scalars["String"]>;
    offer_gt?: InputMaybe<Scalars["String"]>;
    offer_lt?: InputMaybe<Scalars["String"]>;
    offer_gte?: InputMaybe<Scalars["String"]>;
    offer_lte?: InputMaybe<Scalars["String"]>;
    offer_in?: InputMaybe<Array<Scalars["String"]>>;
    offer_not_in?: InputMaybe<Array<Scalars["String"]>>;
    offer_contains?: InputMaybe<Scalars["String"]>;
    offer_contains_nocase?: InputMaybe<Scalars["String"]>;
    offer_not_contains?: InputMaybe<Scalars["String"]>;
    offer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    offer_starts_with?: InputMaybe<Scalars["String"]>;
    offer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    offer_not_starts_with?: InputMaybe<Scalars["String"]>;
    offer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    offer_ends_with?: InputMaybe<Scalars["String"]>;
    offer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    offer_not_ends_with?: InputMaybe<Scalars["String"]>;
    offer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    offer_?: InputMaybe<Offer_filter>;
    isOpen?: InputMaybe<Scalars["Boolean"]>;
    isOpen_not?: InputMaybe<Scalars["Boolean"]>;
    isOpen_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isOpen_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    order?: InputMaybe<Scalars["String"]>;
    order_not?: InputMaybe<Scalars["String"]>;
    order_gt?: InputMaybe<Scalars["String"]>;
    order_lt?: InputMaybe<Scalars["String"]>;
    order_gte?: InputMaybe<Scalars["String"]>;
    order_lte?: InputMaybe<Scalars["String"]>;
    order_in?: InputMaybe<Array<Scalars["String"]>>;
    order_not_in?: InputMaybe<Array<Scalars["String"]>>;
    order_contains?: InputMaybe<Scalars["String"]>;
    order_contains_nocase?: InputMaybe<Scalars["String"]>;
    order_not_contains?: InputMaybe<Scalars["String"]>;
    order_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    order_starts_with?: InputMaybe<Scalars["String"]>;
    order_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    order_not_starts_with?: InputMaybe<Scalars["String"]>;
    order_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    order_ends_with?: InputMaybe<Scalars["String"]>;
    order_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    order_not_ends_with?: InputMaybe<Scalars["String"]>;
    order_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    order_?: InputMaybe<Order_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<LimitOrder_filter>>>;
    or?: InputMaybe<Array<InputMaybe<LimitOrder_filter>>>;
  };

  export type LimitOrder_orderBy =
    | "id"
    | "creationDate"
    | "latestUpdateDate"
    | "wants"
    | "gives"
    | "expiryDate"
    | "fillWants"
    | "fillOrKill"
    | "restingOrder"
    | "realTaker"
    | "realTaker__id"
    | "realTaker__address"
    | "realTaker__creationDate"
    | "realTaker__latestInteractionDate"
    | "offer"
    | "offer__id"
    | "offer__latestTransactionHash"
    | "offer__latestLogIndex"
    | "offer__creationDate"
    | "offer__latestUpdateDate"
    | "offer__offerId"
    | "offer__wants"
    | "offer__gives"
    | "offer__gasprice"
    | "offer__gasreq"
    | "offer__gasBase"
    | "offer__prev"
    | "offer__isOpen"
    | "offer__isFailed"
    | "offer__isFilled"
    | "offer__isRetracted"
    | "offer__failedReason"
    | "offer__posthookFailReason"
    | "offer__deprovisioned"
    | "offer__totalGot"
    | "offer__totalGave"
    | "offer__prevGives"
    | "offer__prevWants"
    | "isOpen"
    | "order"
    | "order__id"
    | "order__transactionHash"
    | "order__creationDate"
    | "order__takerGot"
    | "order__takerGave"
    | "order__penalty"
    | "order__feePaid";

  export type Market = {
    id: Scalars["String"];
    outbound_tkn: Scalars["Bytes"];
    inbound_tkn: Scalars["Bytes"];
    active: Scalars["Boolean"];
    gasbase: Scalars["BigInt"];
  };

  export type Market_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    outbound_tkn?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_not?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_gt?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_lt?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_gte?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_lte?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    outbound_tkn_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    outbound_tkn_contains?: InputMaybe<Scalars["Bytes"]>;
    outbound_tkn_not_contains?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_not?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_gt?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_lt?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_gte?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_lte?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    inbound_tkn_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    inbound_tkn_contains?: InputMaybe<Scalars["Bytes"]>;
    inbound_tkn_not_contains?: InputMaybe<Scalars["Bytes"]>;
    active?: InputMaybe<Scalars["Boolean"]>;
    active_not?: InputMaybe<Scalars["Boolean"]>;
    active_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    active_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    gasbase?: InputMaybe<Scalars["BigInt"]>;
    gasbase_not?: InputMaybe<Scalars["BigInt"]>;
    gasbase_gt?: InputMaybe<Scalars["BigInt"]>;
    gasbase_lt?: InputMaybe<Scalars["BigInt"]>;
    gasbase_gte?: InputMaybe<Scalars["BigInt"]>;
    gasbase_lte?: InputMaybe<Scalars["BigInt"]>;
    gasbase_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasbase_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Market_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Market_filter>>>;
  };

  export type Market_orderBy =
    | "id"
    | "outbound_tkn"
    | "inbound_tkn"
    | "active"
    | "gasbase";

  export type Offer = {
    id: Scalars["String"];
    latestTransactionHash: Scalars["Bytes"];
    latestLogIndex: Scalars["BigInt"];
    creationDate: Scalars["BigInt"];
    latestUpdateDate: Scalars["BigInt"];
    offerId: Scalars["BigInt"];
    wants: Scalars["BigInt"];
    gives: Scalars["BigInt"];
    gasprice: Scalars["BigInt"];
    gasreq: Scalars["BigInt"];
    gasBase: Scalars["BigInt"];
    prev: Scalars["BigInt"];
    isOpen: Scalars["Boolean"];
    isFailed: Scalars["Boolean"];
    isFilled: Scalars["Boolean"];
    isRetracted: Scalars["Boolean"];
    failedReason?: Maybe<Scalars["Bytes"]>;
    posthookFailReason?: Maybe<Scalars["Bytes"]>;
    deprovisioned: Scalars["Boolean"];
    totalGot: Scalars["BigInt"];
    totalGave: Scalars["BigInt"];
    prevGives?: Maybe<Scalars["BigInt"]>;
    prevWants?: Maybe<Scalars["BigInt"]>;
    market: Market;
    maker: Account;
    owner?: Maybe<Account>;
    kandel?: Maybe<Kandel>;
  };

  export type Offer_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    latestTransactionHash?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    latestTransactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    latestTransactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    latestTransactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    latestLogIndex?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_not?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_gt?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_lt?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_gte?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_lte?: InputMaybe<Scalars["BigInt"]>;
    latestLogIndex_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestLogIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestUpdateDate?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_not?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_gt?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_lt?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_gte?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_lte?: InputMaybe<Scalars["BigInt"]>;
    latestUpdateDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    latestUpdateDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    offerId?: InputMaybe<Scalars["BigInt"]>;
    offerId_not?: InputMaybe<Scalars["BigInt"]>;
    offerId_gt?: InputMaybe<Scalars["BigInt"]>;
    offerId_lt?: InputMaybe<Scalars["BigInt"]>;
    offerId_gte?: InputMaybe<Scalars["BigInt"]>;
    offerId_lte?: InputMaybe<Scalars["BigInt"]>;
    offerId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    offerId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    wants?: InputMaybe<Scalars["BigInt"]>;
    wants_not?: InputMaybe<Scalars["BigInt"]>;
    wants_gt?: InputMaybe<Scalars["BigInt"]>;
    wants_lt?: InputMaybe<Scalars["BigInt"]>;
    wants_gte?: InputMaybe<Scalars["BigInt"]>;
    wants_lte?: InputMaybe<Scalars["BigInt"]>;
    wants_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    wants_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gives?: InputMaybe<Scalars["BigInt"]>;
    gives_not?: InputMaybe<Scalars["BigInt"]>;
    gives_gt?: InputMaybe<Scalars["BigInt"]>;
    gives_lt?: InputMaybe<Scalars["BigInt"]>;
    gives_gte?: InputMaybe<Scalars["BigInt"]>;
    gives_lte?: InputMaybe<Scalars["BigInt"]>;
    gives_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gives_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice?: InputMaybe<Scalars["BigInt"]>;
    gasprice_not?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lt?: InputMaybe<Scalars["BigInt"]>;
    gasprice_gte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_lte?: InputMaybe<Scalars["BigInt"]>;
    gasprice_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasprice_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq?: InputMaybe<Scalars["BigInt"]>;
    gasreq_not?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lt?: InputMaybe<Scalars["BigInt"]>;
    gasreq_gte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_lte?: InputMaybe<Scalars["BigInt"]>;
    gasreq_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasreq_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasBase?: InputMaybe<Scalars["BigInt"]>;
    gasBase_not?: InputMaybe<Scalars["BigInt"]>;
    gasBase_gt?: InputMaybe<Scalars["BigInt"]>;
    gasBase_lt?: InputMaybe<Scalars["BigInt"]>;
    gasBase_gte?: InputMaybe<Scalars["BigInt"]>;
    gasBase_lte?: InputMaybe<Scalars["BigInt"]>;
    gasBase_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    gasBase_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prev?: InputMaybe<Scalars["BigInt"]>;
    prev_not?: InputMaybe<Scalars["BigInt"]>;
    prev_gt?: InputMaybe<Scalars["BigInt"]>;
    prev_lt?: InputMaybe<Scalars["BigInt"]>;
    prev_gte?: InputMaybe<Scalars["BigInt"]>;
    prev_lte?: InputMaybe<Scalars["BigInt"]>;
    prev_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prev_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    isOpen?: InputMaybe<Scalars["Boolean"]>;
    isOpen_not?: InputMaybe<Scalars["Boolean"]>;
    isOpen_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isOpen_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isFailed?: InputMaybe<Scalars["Boolean"]>;
    isFailed_not?: InputMaybe<Scalars["Boolean"]>;
    isFailed_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isFailed_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isFilled?: InputMaybe<Scalars["Boolean"]>;
    isFilled_not?: InputMaybe<Scalars["Boolean"]>;
    isFilled_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isFilled_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isRetracted?: InputMaybe<Scalars["Boolean"]>;
    isRetracted_not?: InputMaybe<Scalars["Boolean"]>;
    isRetracted_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    isRetracted_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    failedReason?: InputMaybe<Scalars["Bytes"]>;
    failedReason_not?: InputMaybe<Scalars["Bytes"]>;
    failedReason_gt?: InputMaybe<Scalars["Bytes"]>;
    failedReason_lt?: InputMaybe<Scalars["Bytes"]>;
    failedReason_gte?: InputMaybe<Scalars["Bytes"]>;
    failedReason_lte?: InputMaybe<Scalars["Bytes"]>;
    failedReason_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    failedReason_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    failedReason_contains?: InputMaybe<Scalars["Bytes"]>;
    failedReason_not_contains?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_not?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_gt?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_lt?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_gte?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_lte?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    posthookFailReason_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    posthookFailReason_contains?: InputMaybe<Scalars["Bytes"]>;
    posthookFailReason_not_contains?: InputMaybe<Scalars["Bytes"]>;
    deprovisioned?: InputMaybe<Scalars["Boolean"]>;
    deprovisioned_not?: InputMaybe<Scalars["Boolean"]>;
    deprovisioned_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    deprovisioned_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
    totalGot?: InputMaybe<Scalars["BigInt"]>;
    totalGot_not?: InputMaybe<Scalars["BigInt"]>;
    totalGot_gt?: InputMaybe<Scalars["BigInt"]>;
    totalGot_lt?: InputMaybe<Scalars["BigInt"]>;
    totalGot_gte?: InputMaybe<Scalars["BigInt"]>;
    totalGot_lte?: InputMaybe<Scalars["BigInt"]>;
    totalGot_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    totalGot_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    totalGave?: InputMaybe<Scalars["BigInt"]>;
    totalGave_not?: InputMaybe<Scalars["BigInt"]>;
    totalGave_gt?: InputMaybe<Scalars["BigInt"]>;
    totalGave_lt?: InputMaybe<Scalars["BigInt"]>;
    totalGave_gte?: InputMaybe<Scalars["BigInt"]>;
    totalGave_lte?: InputMaybe<Scalars["BigInt"]>;
    totalGave_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    totalGave_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prevGives?: InputMaybe<Scalars["BigInt"]>;
    prevGives_not?: InputMaybe<Scalars["BigInt"]>;
    prevGives_gt?: InputMaybe<Scalars["BigInt"]>;
    prevGives_lt?: InputMaybe<Scalars["BigInt"]>;
    prevGives_gte?: InputMaybe<Scalars["BigInt"]>;
    prevGives_lte?: InputMaybe<Scalars["BigInt"]>;
    prevGives_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prevGives_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prevWants?: InputMaybe<Scalars["BigInt"]>;
    prevWants_not?: InputMaybe<Scalars["BigInt"]>;
    prevWants_gt?: InputMaybe<Scalars["BigInt"]>;
    prevWants_lt?: InputMaybe<Scalars["BigInt"]>;
    prevWants_gte?: InputMaybe<Scalars["BigInt"]>;
    prevWants_lte?: InputMaybe<Scalars["BigInt"]>;
    prevWants_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    prevWants_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    market?: InputMaybe<Scalars["String"]>;
    market_not?: InputMaybe<Scalars["String"]>;
    market_gt?: InputMaybe<Scalars["String"]>;
    market_lt?: InputMaybe<Scalars["String"]>;
    market_gte?: InputMaybe<Scalars["String"]>;
    market_lte?: InputMaybe<Scalars["String"]>;
    market_in?: InputMaybe<Array<Scalars["String"]>>;
    market_not_in?: InputMaybe<Array<Scalars["String"]>>;
    market_contains?: InputMaybe<Scalars["String"]>;
    market_contains_nocase?: InputMaybe<Scalars["String"]>;
    market_not_contains?: InputMaybe<Scalars["String"]>;
    market_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    market_starts_with?: InputMaybe<Scalars["String"]>;
    market_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    market_not_starts_with?: InputMaybe<Scalars["String"]>;
    market_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    market_ends_with?: InputMaybe<Scalars["String"]>;
    market_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    market_not_ends_with?: InputMaybe<Scalars["String"]>;
    market_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    market_?: InputMaybe<Market_filter>;
    maker?: InputMaybe<Scalars["String"]>;
    maker_not?: InputMaybe<Scalars["String"]>;
    maker_gt?: InputMaybe<Scalars["String"]>;
    maker_lt?: InputMaybe<Scalars["String"]>;
    maker_gte?: InputMaybe<Scalars["String"]>;
    maker_lte?: InputMaybe<Scalars["String"]>;
    maker_in?: InputMaybe<Array<Scalars["String"]>>;
    maker_not_in?: InputMaybe<Array<Scalars["String"]>>;
    maker_contains?: InputMaybe<Scalars["String"]>;
    maker_contains_nocase?: InputMaybe<Scalars["String"]>;
    maker_not_contains?: InputMaybe<Scalars["String"]>;
    maker_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    maker_starts_with?: InputMaybe<Scalars["String"]>;
    maker_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    maker_not_starts_with?: InputMaybe<Scalars["String"]>;
    maker_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    maker_ends_with?: InputMaybe<Scalars["String"]>;
    maker_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    maker_not_ends_with?: InputMaybe<Scalars["String"]>;
    maker_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    maker_?: InputMaybe<Account_filter>;
    owner?: InputMaybe<Scalars["String"]>;
    owner_not?: InputMaybe<Scalars["String"]>;
    owner_gt?: InputMaybe<Scalars["String"]>;
    owner_lt?: InputMaybe<Scalars["String"]>;
    owner_gte?: InputMaybe<Scalars["String"]>;
    owner_lte?: InputMaybe<Scalars["String"]>;
    owner_in?: InputMaybe<Array<Scalars["String"]>>;
    owner_not_in?: InputMaybe<Array<Scalars["String"]>>;
    owner_contains?: InputMaybe<Scalars["String"]>;
    owner_contains_nocase?: InputMaybe<Scalars["String"]>;
    owner_not_contains?: InputMaybe<Scalars["String"]>;
    owner_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    owner_starts_with?: InputMaybe<Scalars["String"]>;
    owner_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    owner_not_starts_with?: InputMaybe<Scalars["String"]>;
    owner_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    owner_ends_with?: InputMaybe<Scalars["String"]>;
    owner_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    owner_not_ends_with?: InputMaybe<Scalars["String"]>;
    owner_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    owner_?: InputMaybe<Account_filter>;
    kandel?: InputMaybe<Scalars["String"]>;
    kandel_not?: InputMaybe<Scalars["String"]>;
    kandel_gt?: InputMaybe<Scalars["String"]>;
    kandel_lt?: InputMaybe<Scalars["String"]>;
    kandel_gte?: InputMaybe<Scalars["String"]>;
    kandel_lte?: InputMaybe<Scalars["String"]>;
    kandel_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_not_in?: InputMaybe<Array<Scalars["String"]>>;
    kandel_contains?: InputMaybe<Scalars["String"]>;
    kandel_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_contains?: InputMaybe<Scalars["String"]>;
    kandel_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    kandel_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with?: InputMaybe<Scalars["String"]>;
    kandel_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with?: InputMaybe<Scalars["String"]>;
    kandel_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    kandel_?: InputMaybe<Kandel_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Offer_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Offer_filter>>>;
  };

  export type Offer_orderBy =
    | "id"
    | "latestTransactionHash"
    | "latestLogIndex"
    | "creationDate"
    | "latestUpdateDate"
    | "offerId"
    | "wants"
    | "gives"
    | "gasprice"
    | "gasreq"
    | "gasBase"
    | "prev"
    | "isOpen"
    | "isFailed"
    | "isFilled"
    | "isRetracted"
    | "failedReason"
    | "posthookFailReason"
    | "deprovisioned"
    | "totalGot"
    | "totalGave"
    | "prevGives"
    | "prevWants"
    | "market"
    | "market__id"
    | "market__outbound_tkn"
    | "market__inbound_tkn"
    | "market__active"
    | "market__gasbase"
    | "maker"
    | "maker__id"
    | "maker__address"
    | "maker__creationDate"
    | "maker__latestInteractionDate"
    | "owner"
    | "owner__id"
    | "owner__address"
    | "owner__creationDate"
    | "owner__latestInteractionDate"
    | "kandel"
    | "kandel__id"
    | "kandel__transactionHash"
    | "kandel__creationDate"
    | "kandel__seeder"
    | "kandel__address"
    | "kandel__base"
    | "kandel__quote"
    | "kandel__reserveId"
    | "kandel__router"
    | "kandel__depositedBase"
    | "kandel__depositedQuote"
    | "kandel__gasprice"
    | "kandel__gasreq"
    | "kandel__compoundRateBase"
    | "kandel__compoundRateQuote"
    | "kandel__spread"
    | "kandel__ratio"
    | "kandel__length";

  export type Order = {
    id: Scalars["String"];
    transactionHash: Scalars["Bytes"];
    creationDate: Scalars["BigInt"];
    taker?: Maybe<Account>;
    takerGot?: Maybe<Scalars["BigInt"]>;
    takerGave?: Maybe<Scalars["BigInt"]>;
    penalty?: Maybe<Scalars["BigInt"]>;
    feePaid?: Maybe<Scalars["BigInt"]>;
    market?: Maybe<Market>;
    limitOrder?: Maybe<LimitOrder>;
  };

  /** Defines the order direction, either ascending or descending */
  export type OrderDirection = "asc" | "desc";

  export type OrderStack = {
    id: Scalars["String"];
    ids: Scalars["String"];
    last?: Maybe<Order>;
  };

  export type OrderStack_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    ids?: InputMaybe<Scalars["String"]>;
    ids_not?: InputMaybe<Scalars["String"]>;
    ids_gt?: InputMaybe<Scalars["String"]>;
    ids_lt?: InputMaybe<Scalars["String"]>;
    ids_gte?: InputMaybe<Scalars["String"]>;
    ids_lte?: InputMaybe<Scalars["String"]>;
    ids_in?: InputMaybe<Array<Scalars["String"]>>;
    ids_not_in?: InputMaybe<Array<Scalars["String"]>>;
    ids_contains?: InputMaybe<Scalars["String"]>;
    ids_contains_nocase?: InputMaybe<Scalars["String"]>;
    ids_not_contains?: InputMaybe<Scalars["String"]>;
    ids_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    ids_starts_with?: InputMaybe<Scalars["String"]>;
    ids_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    ids_not_starts_with?: InputMaybe<Scalars["String"]>;
    ids_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    ids_ends_with?: InputMaybe<Scalars["String"]>;
    ids_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    ids_not_ends_with?: InputMaybe<Scalars["String"]>;
    ids_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    last?: InputMaybe<Scalars["String"]>;
    last_not?: InputMaybe<Scalars["String"]>;
    last_gt?: InputMaybe<Scalars["String"]>;
    last_lt?: InputMaybe<Scalars["String"]>;
    last_gte?: InputMaybe<Scalars["String"]>;
    last_lte?: InputMaybe<Scalars["String"]>;
    last_in?: InputMaybe<Array<Scalars["String"]>>;
    last_not_in?: InputMaybe<Array<Scalars["String"]>>;
    last_contains?: InputMaybe<Scalars["String"]>;
    last_contains_nocase?: InputMaybe<Scalars["String"]>;
    last_not_contains?: InputMaybe<Scalars["String"]>;
    last_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    last_starts_with?: InputMaybe<Scalars["String"]>;
    last_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    last_not_starts_with?: InputMaybe<Scalars["String"]>;
    last_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    last_ends_with?: InputMaybe<Scalars["String"]>;
    last_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    last_not_ends_with?: InputMaybe<Scalars["String"]>;
    last_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    last_?: InputMaybe<Order_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<OrderStack_filter>>>;
    or?: InputMaybe<Array<InputMaybe<OrderStack_filter>>>;
  };

  export type OrderStack_orderBy =
    | "id"
    | "ids"
    | "last"
    | "last__id"
    | "last__transactionHash"
    | "last__creationDate"
    | "last__takerGot"
    | "last__takerGave"
    | "last__penalty"
    | "last__feePaid";

  export type Order_filter = {
    id?: InputMaybe<Scalars["String"]>;
    id_not?: InputMaybe<Scalars["String"]>;
    id_gt?: InputMaybe<Scalars["String"]>;
    id_lt?: InputMaybe<Scalars["String"]>;
    id_gte?: InputMaybe<Scalars["String"]>;
    id_lte?: InputMaybe<Scalars["String"]>;
    id_in?: InputMaybe<Array<Scalars["String"]>>;
    id_not_in?: InputMaybe<Array<Scalars["String"]>>;
    id_contains?: InputMaybe<Scalars["String"]>;
    id_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_not_contains?: InputMaybe<Scalars["String"]>;
    id_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    id_starts_with?: InputMaybe<Scalars["String"]>;
    id_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_starts_with?: InputMaybe<Scalars["String"]>;
    id_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    id_ends_with?: InputMaybe<Scalars["String"]>;
    id_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    id_not_ends_with?: InputMaybe<Scalars["String"]>;
    id_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    transactionHash?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
    transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
    transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
    creationDate?: InputMaybe<Scalars["BigInt"]>;
    creationDate_not?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lt?: InputMaybe<Scalars["BigInt"]>;
    creationDate_gte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_lte?: InputMaybe<Scalars["BigInt"]>;
    creationDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    creationDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    taker?: InputMaybe<Scalars["String"]>;
    taker_not?: InputMaybe<Scalars["String"]>;
    taker_gt?: InputMaybe<Scalars["String"]>;
    taker_lt?: InputMaybe<Scalars["String"]>;
    taker_gte?: InputMaybe<Scalars["String"]>;
    taker_lte?: InputMaybe<Scalars["String"]>;
    taker_in?: InputMaybe<Array<Scalars["String"]>>;
    taker_not_in?: InputMaybe<Array<Scalars["String"]>>;
    taker_contains?: InputMaybe<Scalars["String"]>;
    taker_contains_nocase?: InputMaybe<Scalars["String"]>;
    taker_not_contains?: InputMaybe<Scalars["String"]>;
    taker_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    taker_starts_with?: InputMaybe<Scalars["String"]>;
    taker_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    taker_not_starts_with?: InputMaybe<Scalars["String"]>;
    taker_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    taker_ends_with?: InputMaybe<Scalars["String"]>;
    taker_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    taker_not_ends_with?: InputMaybe<Scalars["String"]>;
    taker_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    taker_?: InputMaybe<Account_filter>;
    takerGot?: InputMaybe<Scalars["BigInt"]>;
    takerGot_not?: InputMaybe<Scalars["BigInt"]>;
    takerGot_gt?: InputMaybe<Scalars["BigInt"]>;
    takerGot_lt?: InputMaybe<Scalars["BigInt"]>;
    takerGot_gte?: InputMaybe<Scalars["BigInt"]>;
    takerGot_lte?: InputMaybe<Scalars["BigInt"]>;
    takerGot_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    takerGot_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    takerGave?: InputMaybe<Scalars["BigInt"]>;
    takerGave_not?: InputMaybe<Scalars["BigInt"]>;
    takerGave_gt?: InputMaybe<Scalars["BigInt"]>;
    takerGave_lt?: InputMaybe<Scalars["BigInt"]>;
    takerGave_gte?: InputMaybe<Scalars["BigInt"]>;
    takerGave_lte?: InputMaybe<Scalars["BigInt"]>;
    takerGave_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    takerGave_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    penalty?: InputMaybe<Scalars["BigInt"]>;
    penalty_not?: InputMaybe<Scalars["BigInt"]>;
    penalty_gt?: InputMaybe<Scalars["BigInt"]>;
    penalty_lt?: InputMaybe<Scalars["BigInt"]>;
    penalty_gte?: InputMaybe<Scalars["BigInt"]>;
    penalty_lte?: InputMaybe<Scalars["BigInt"]>;
    penalty_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    penalty_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    feePaid?: InputMaybe<Scalars["BigInt"]>;
    feePaid_not?: InputMaybe<Scalars["BigInt"]>;
    feePaid_gt?: InputMaybe<Scalars["BigInt"]>;
    feePaid_lt?: InputMaybe<Scalars["BigInt"]>;
    feePaid_gte?: InputMaybe<Scalars["BigInt"]>;
    feePaid_lte?: InputMaybe<Scalars["BigInt"]>;
    feePaid_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    feePaid_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
    market?: InputMaybe<Scalars["String"]>;
    market_not?: InputMaybe<Scalars["String"]>;
    market_gt?: InputMaybe<Scalars["String"]>;
    market_lt?: InputMaybe<Scalars["String"]>;
    market_gte?: InputMaybe<Scalars["String"]>;
    market_lte?: InputMaybe<Scalars["String"]>;
    market_in?: InputMaybe<Array<Scalars["String"]>>;
    market_not_in?: InputMaybe<Array<Scalars["String"]>>;
    market_contains?: InputMaybe<Scalars["String"]>;
    market_contains_nocase?: InputMaybe<Scalars["String"]>;
    market_not_contains?: InputMaybe<Scalars["String"]>;
    market_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    market_starts_with?: InputMaybe<Scalars["String"]>;
    market_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    market_not_starts_with?: InputMaybe<Scalars["String"]>;
    market_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    market_ends_with?: InputMaybe<Scalars["String"]>;
    market_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    market_not_ends_with?: InputMaybe<Scalars["String"]>;
    market_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    market_?: InputMaybe<Market_filter>;
    limitOrder?: InputMaybe<Scalars["String"]>;
    limitOrder_not?: InputMaybe<Scalars["String"]>;
    limitOrder_gt?: InputMaybe<Scalars["String"]>;
    limitOrder_lt?: InputMaybe<Scalars["String"]>;
    limitOrder_gte?: InputMaybe<Scalars["String"]>;
    limitOrder_lte?: InputMaybe<Scalars["String"]>;
    limitOrder_in?: InputMaybe<Array<Scalars["String"]>>;
    limitOrder_not_in?: InputMaybe<Array<Scalars["String"]>>;
    limitOrder_contains?: InputMaybe<Scalars["String"]>;
    limitOrder_contains_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_not_contains?: InputMaybe<Scalars["String"]>;
    limitOrder_not_contains_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_starts_with?: InputMaybe<Scalars["String"]>;
    limitOrder_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_not_starts_with?: InputMaybe<Scalars["String"]>;
    limitOrder_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_ends_with?: InputMaybe<Scalars["String"]>;
    limitOrder_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_not_ends_with?: InputMaybe<Scalars["String"]>;
    limitOrder_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
    limitOrder_?: InputMaybe<LimitOrder_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Order_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Order_filter>>>;
  };

  export type Order_orderBy =
    | "id"
    | "transactionHash"
    | "creationDate"
    | "taker"
    | "taker__id"
    | "taker__address"
    | "taker__creationDate"
    | "taker__latestInteractionDate"
    | "takerGot"
    | "takerGave"
    | "penalty"
    | "feePaid"
    | "market"
    | "market__id"
    | "market__outbound_tkn"
    | "market__inbound_tkn"
    | "market__active"
    | "market__gasbase"
    | "limitOrder"
    | "limitOrder__id"
    | "limitOrder__creationDate"
    | "limitOrder__latestUpdateDate"
    | "limitOrder__wants"
    | "limitOrder__gives"
    | "limitOrder__expiryDate"
    | "limitOrder__fillWants"
    | "limitOrder__fillOrKill"
    | "limitOrder__restingOrder"
    | "limitOrder__isOpen";

  export type Query = {
    account?: Maybe<Account>;
    accounts: Array<Account>;
    accountVolumeByPair?: Maybe<AccountVolumeByPair>;
    accountVolumeByPairs: Array<AccountVolumeByPair>;
    market?: Maybe<Market>;
    markets: Array<Market>;
    offer?: Maybe<Offer>;
    offers: Array<Offer>;
    order?: Maybe<Order>;
    orders: Array<Order>;
    limitOrder?: Maybe<LimitOrder>;
    limitOrders: Array<LimitOrder>;
    kandelDepositWithdraw?: Maybe<KandelDepositWithdraw>;
    kandelDepositWithdraws: Array<KandelDepositWithdraw>;
    kandel?: Maybe<Kandel>;
    kandels: Array<Kandel>;
    kandelPopulateRetract?: Maybe<KandelPopulateRetract>;
    kandelPopulateRetracts: Array<KandelPopulateRetract>;
    kandelParameters: Array<KandelParameters>;
    orderStack?: Maybe<OrderStack>;
    orderStacks: Array<OrderStack>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
  };

  export type QueryaccountArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryaccountsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Account_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Account_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryaccountVolumeByPairArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryaccountVolumeByPairsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<AccountVolumeByPair_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<AccountVolumeByPair_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerymarketArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerymarketsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Market_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Market_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryofferArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryoffersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Offer_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Offer_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryorderArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryordersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Order_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Order_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerylimitOrderArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerylimitOrdersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<LimitOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<LimitOrder_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelDepositWithdrawArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelDepositWithdrawsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelDepositWithdraw_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelDepositWithdraw_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Kandel_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Kandel_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelPopulateRetractArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelPopulateRetractsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelPopulateRetract_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelPopulateRetract_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerykandelParametersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelParameters_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelParameters_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryorderStackArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryorderStacksArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<OrderStack_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OrderStack_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type Query_metaArgs = {
    block?: InputMaybe<Block_height>;
  };

  export type Subscription = {
    account?: Maybe<Account>;
    accounts: Array<Account>;
    accountVolumeByPair?: Maybe<AccountVolumeByPair>;
    accountVolumeByPairs: Array<AccountVolumeByPair>;
    market?: Maybe<Market>;
    markets: Array<Market>;
    offer?: Maybe<Offer>;
    offers: Array<Offer>;
    order?: Maybe<Order>;
    orders: Array<Order>;
    limitOrder?: Maybe<LimitOrder>;
    limitOrders: Array<LimitOrder>;
    kandelDepositWithdraw?: Maybe<KandelDepositWithdraw>;
    kandelDepositWithdraws: Array<KandelDepositWithdraw>;
    kandel?: Maybe<Kandel>;
    kandels: Array<Kandel>;
    kandelPopulateRetract?: Maybe<KandelPopulateRetract>;
    kandelPopulateRetracts: Array<KandelPopulateRetract>;
    kandelParameters: Array<KandelParameters>;
    orderStack?: Maybe<OrderStack>;
    orderStacks: Array<OrderStack>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
  };

  export type SubscriptionaccountArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionaccountsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Account_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Account_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionaccountVolumeByPairArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionaccountVolumeByPairsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<AccountVolumeByPair_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<AccountVolumeByPair_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionmarketArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionmarketsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Market_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Market_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionofferArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionoffersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Offer_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Offer_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionorderArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionordersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Order_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Order_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionlimitOrderArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionlimitOrdersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<LimitOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<LimitOrder_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelDepositWithdrawArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelDepositWithdrawsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelDepositWithdraw_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelDepositWithdraw_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<Kandel_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Kandel_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelPopulateRetractArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelPopulateRetractsArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelPopulateRetract_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelPopulateRetract_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionkandelParametersArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<KandelParameters_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<KandelParameters_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionorderStackArgs = {
    id: Scalars["ID"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionorderStacksArgs = {
    skip?: InputMaybe<Scalars["Int"]>;
    first?: InputMaybe<Scalars["Int"]>;
    orderBy?: InputMaybe<OrderStack_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OrderStack_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type Subscription_metaArgs = {
    block?: InputMaybe<Block_height>;
  };

  export type _Block_ = {
    /** The hash of the block */
    hash?: Maybe<Scalars["Bytes"]>;
    /** The block number */
    number: Scalars["Int"];
    /** Integer representation of the timestamp stored in blocks for the chain */
    timestamp?: Maybe<Scalars["Int"]>;
  };

  /** The type for the top-level _meta field */
  export type _Meta_ = {
    /**
     * Information about a specific subgraph block. The hash of the block
     * will be null if the _meta field has a block constraint that asks for
     * a block number. It will be filled if the _meta field has no block constraint
     * and therefore asks for the latest  block
     *
     */
    block: _Block_;
    /** The deployment ID */
    deployment: Scalars["String"];
    /** If `true`, the subgraph encountered indexing errors at some past block */
    hasIndexingErrors: Scalars["Boolean"];
  };

  export type _SubgraphErrorPolicy_ =
    /** Data will be returned even if the subgraph has indexing errors */
    | "allow"
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    | "deny";

  export type QuerySdk = {
    /** null **/
    account: InContextSdkMethod<
      Query["account"],
      QueryaccountArgs,
      MeshContext
    >;
    /** null **/
    accounts: InContextSdkMethod<
      Query["accounts"],
      QueryaccountsArgs,
      MeshContext
    >;
    /** null **/
    accountVolumeByPair: InContextSdkMethod<
      Query["accountVolumeByPair"],
      QueryaccountVolumeByPairArgs,
      MeshContext
    >;
    /** null **/
    accountVolumeByPairs: InContextSdkMethod<
      Query["accountVolumeByPairs"],
      QueryaccountVolumeByPairsArgs,
      MeshContext
    >;
    /** null **/
    market: InContextSdkMethod<Query["market"], QuerymarketArgs, MeshContext>;
    /** null **/
    markets: InContextSdkMethod<
      Query["markets"],
      QuerymarketsArgs,
      MeshContext
    >;
    /** null **/
    offer: InContextSdkMethod<Query["offer"], QueryofferArgs, MeshContext>;
    /** null **/
    offers: InContextSdkMethod<Query["offers"], QueryoffersArgs, MeshContext>;
    /** null **/
    order: InContextSdkMethod<Query["order"], QueryorderArgs, MeshContext>;
    /** null **/
    orders: InContextSdkMethod<Query["orders"], QueryordersArgs, MeshContext>;
    /** null **/
    limitOrder: InContextSdkMethod<
      Query["limitOrder"],
      QuerylimitOrderArgs,
      MeshContext
    >;
    /** null **/
    limitOrders: InContextSdkMethod<
      Query["limitOrders"],
      QuerylimitOrdersArgs,
      MeshContext
    >;
    /** null **/
    kandelDepositWithdraw: InContextSdkMethod<
      Query["kandelDepositWithdraw"],
      QuerykandelDepositWithdrawArgs,
      MeshContext
    >;
    /** null **/
    kandelDepositWithdraws: InContextSdkMethod<
      Query["kandelDepositWithdraws"],
      QuerykandelDepositWithdrawsArgs,
      MeshContext
    >;
    /** null **/
    kandel: InContextSdkMethod<Query["kandel"], QuerykandelArgs, MeshContext>;
    /** null **/
    kandels: InContextSdkMethod<
      Query["kandels"],
      QuerykandelsArgs,
      MeshContext
    >;
    /** null **/
    kandelPopulateRetract: InContextSdkMethod<
      Query["kandelPopulateRetract"],
      QuerykandelPopulateRetractArgs,
      MeshContext
    >;
    /** null **/
    kandelPopulateRetracts: InContextSdkMethod<
      Query["kandelPopulateRetracts"],
      QuerykandelPopulateRetractsArgs,
      MeshContext
    >;
    /** null **/
    kandelParameters: InContextSdkMethod<
      Query["kandelParameters"],
      QuerykandelParametersArgs,
      MeshContext
    >;
    /** null **/
    orderStack: InContextSdkMethod<
      Query["orderStack"],
      QueryorderStackArgs,
      MeshContext
    >;
    /** null **/
    orderStacks: InContextSdkMethod<
      Query["orderStacks"],
      QueryorderStacksArgs,
      MeshContext
    >;
    /** Access to subgraph metadata **/
    _meta: InContextSdkMethod<Query["_meta"], Query_metaArgs, MeshContext>;
  };

  export type MutationSdk = {};

  export type SubscriptionSdk = {
    /** null **/
    account: InContextSdkMethod<
      Subscription["account"],
      SubscriptionaccountArgs,
      MeshContext
    >;
    /** null **/
    accounts: InContextSdkMethod<
      Subscription["accounts"],
      SubscriptionaccountsArgs,
      MeshContext
    >;
    /** null **/
    accountVolumeByPair: InContextSdkMethod<
      Subscription["accountVolumeByPair"],
      SubscriptionaccountVolumeByPairArgs,
      MeshContext
    >;
    /** null **/
    accountVolumeByPairs: InContextSdkMethod<
      Subscription["accountVolumeByPairs"],
      SubscriptionaccountVolumeByPairsArgs,
      MeshContext
    >;
    /** null **/
    market: InContextSdkMethod<
      Subscription["market"],
      SubscriptionmarketArgs,
      MeshContext
    >;
    /** null **/
    markets: InContextSdkMethod<
      Subscription["markets"],
      SubscriptionmarketsArgs,
      MeshContext
    >;
    /** null **/
    offer: InContextSdkMethod<
      Subscription["offer"],
      SubscriptionofferArgs,
      MeshContext
    >;
    /** null **/
    offers: InContextSdkMethod<
      Subscription["offers"],
      SubscriptionoffersArgs,
      MeshContext
    >;
    /** null **/
    order: InContextSdkMethod<
      Subscription["order"],
      SubscriptionorderArgs,
      MeshContext
    >;
    /** null **/
    orders: InContextSdkMethod<
      Subscription["orders"],
      SubscriptionordersArgs,
      MeshContext
    >;
    /** null **/
    limitOrder: InContextSdkMethod<
      Subscription["limitOrder"],
      SubscriptionlimitOrderArgs,
      MeshContext
    >;
    /** null **/
    limitOrders: InContextSdkMethod<
      Subscription["limitOrders"],
      SubscriptionlimitOrdersArgs,
      MeshContext
    >;
    /** null **/
    kandelDepositWithdraw: InContextSdkMethod<
      Subscription["kandelDepositWithdraw"],
      SubscriptionkandelDepositWithdrawArgs,
      MeshContext
    >;
    /** null **/
    kandelDepositWithdraws: InContextSdkMethod<
      Subscription["kandelDepositWithdraws"],
      SubscriptionkandelDepositWithdrawsArgs,
      MeshContext
    >;
    /** null **/
    kandel: InContextSdkMethod<
      Subscription["kandel"],
      SubscriptionkandelArgs,
      MeshContext
    >;
    /** null **/
    kandels: InContextSdkMethod<
      Subscription["kandels"],
      SubscriptionkandelsArgs,
      MeshContext
    >;
    /** null **/
    kandelPopulateRetract: InContextSdkMethod<
      Subscription["kandelPopulateRetract"],
      SubscriptionkandelPopulateRetractArgs,
      MeshContext
    >;
    /** null **/
    kandelPopulateRetracts: InContextSdkMethod<
      Subscription["kandelPopulateRetracts"],
      SubscriptionkandelPopulateRetractsArgs,
      MeshContext
    >;
    /** null **/
    kandelParameters: InContextSdkMethod<
      Subscription["kandelParameters"],
      SubscriptionkandelParametersArgs,
      MeshContext
    >;
    /** null **/
    orderStack: InContextSdkMethod<
      Subscription["orderStack"],
      SubscriptionorderStackArgs,
      MeshContext
    >;
    /** null **/
    orderStacks: InContextSdkMethod<
      Subscription["orderStacks"],
      SubscriptionorderStacksArgs,
      MeshContext
    >;
    /** Access to subgraph metadata **/
    _meta: InContextSdkMethod<
      Subscription["_meta"],
      Subscription_metaArgs,
      MeshContext
    >;
  };

  export type Context = {
    ["Mangrove"]: {
      Query: QuerySdk;
      Mutation: MutationSdk;
      Subscription: SubscriptionSdk;
    };
    ["chainName"]: Scalars["ID"];
  };
}
