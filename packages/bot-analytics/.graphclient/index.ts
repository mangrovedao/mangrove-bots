// @ts-nocheck
import {
  GraphQLResolveInfo,
  SelectionSetNode,
  FieldNode,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import { gql } from "@graphql-mesh/utils";

import type { GetMeshOptions } from "@graphql-mesh/runtime";
import type { YamlConfig } from "@graphql-mesh/types";
import { PubSub } from "@graphql-mesh/utils";
import { DefaultLogger } from "@graphql-mesh/utils";
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from "@whatwg-node/fetch";

import { MeshResolvedSource } from "@graphql-mesh/runtime";
import { MeshTransform, MeshPlugin } from "@graphql-mesh/types";
import GraphqlHandler from "@graphql-mesh/graphql";
import { parse } from "graphql";
import AutoPaginationTransform from "@graphprotocol/client-auto-pagination";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from "@graphql-mesh/utils";
import { createMeshHTTPHandler, MeshHTTPHandler } from "@graphql-mesh/http";
import {
  getMesh,
  ExecuteMeshFn,
  SubscribeMeshFn,
  MeshContext as BaseMeshContext,
  MeshInstance,
} from "@graphql-mesh/runtime";
import { MeshStore, FsStoreStorageAdapter } from "@graphql-mesh/store";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import { ImportFn } from "@graphql-mesh/types";
import type { MangroveTypes } from "./sources/Mangrove/types";
import * as importedModule$0 from "./sources/Mangrove/introspectionSchema";
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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
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

export type Account = {
  id: Scalars["Bytes"];
  address: Scalars["Bytes"];
  creationDate: Scalars["BigInt"];
  latestInteractionDate: Scalars["BigInt"];
  volumes: Array<AccountVolumeByPair>;
  chainName: Scalars["String"];
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
  chainName: Scalars["String"];
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
  chainName: Scalars["String"];
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
  chainName: Scalars["String"];
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
  chainName: Scalars["String"];
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
  chainName: Scalars["String"];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  Account: ResolverTypeWrapper<Account>;
  AccountVolumeByPair: ResolverTypeWrapper<AccountVolumeByPair>;
  AccountVolumeByPair_filter: AccountVolumeByPair_filter;
  AccountVolumeByPair_orderBy: AccountVolumeByPair_orderBy;
  Account_filter: Account_filter;
  Account_orderBy: Account_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars["BigDecimal"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Bytes: ResolverTypeWrapper<Scalars["Bytes"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Kandel: ResolverTypeWrapper<Kandel>;
  KandelDepositWithdraw: ResolverTypeWrapper<KandelDepositWithdraw>;
  KandelDepositWithdraw_filter: KandelDepositWithdraw_filter;
  KandelDepositWithdraw_orderBy: KandelDepositWithdraw_orderBy;
  KandelParameters: ResolverTypeWrapper<KandelParameters>;
  KandelParameters_filter: KandelParameters_filter;
  KandelParameters_orderBy: KandelParameters_orderBy;
  KandelPopulateRetract: ResolverTypeWrapper<KandelPopulateRetract>;
  KandelPopulateRetract_filter: KandelPopulateRetract_filter;
  KandelPopulateRetract_orderBy: KandelPopulateRetract_orderBy;
  Kandel_filter: Kandel_filter;
  Kandel_orderBy: Kandel_orderBy;
  LimitOrder: ResolverTypeWrapper<LimitOrder>;
  LimitOrder_filter: LimitOrder_filter;
  LimitOrder_orderBy: LimitOrder_orderBy;
  Market: ResolverTypeWrapper<Market>;
  Market_filter: Market_filter;
  Market_orderBy: Market_orderBy;
  Offer: ResolverTypeWrapper<Offer>;
  Offer_filter: Offer_filter;
  Offer_orderBy: Offer_orderBy;
  Order: ResolverTypeWrapper<Order>;
  OrderDirection: OrderDirection;
  OrderStack: ResolverTypeWrapper<OrderStack>;
  OrderStack_filter: OrderStack_filter;
  OrderStack_orderBy: OrderStack_orderBy;
  Order_filter: Order_filter;
  Order_orderBy: Order_orderBy;
  String: ResolverTypeWrapper<Scalars["String"]>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  Account: Account;
  AccountVolumeByPair: AccountVolumeByPair;
  AccountVolumeByPair_filter: AccountVolumeByPair_filter;
  Account_filter: Account_filter;
  BigDecimal: Scalars["BigDecimal"];
  BigInt: Scalars["BigInt"];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars["Boolean"];
  Bytes: Scalars["Bytes"];
  Float: Scalars["Float"];
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Kandel: Kandel;
  KandelDepositWithdraw: KandelDepositWithdraw;
  KandelDepositWithdraw_filter: KandelDepositWithdraw_filter;
  KandelParameters: KandelParameters;
  KandelParameters_filter: KandelParameters_filter;
  KandelPopulateRetract: KandelPopulateRetract;
  KandelPopulateRetract_filter: KandelPopulateRetract_filter;
  Kandel_filter: Kandel_filter;
  LimitOrder: LimitOrder;
  LimitOrder_filter: LimitOrder_filter;
  Market: Market;
  Market_filter: Market_filter;
  Offer: Offer;
  Offer_filter: Offer_filter;
  Order: Order;
  OrderStack: OrderStack;
  OrderStack_filter: OrderStack_filter;
  Order_filter: Order_filter;
  String: Scalars["String"];
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext & { chainName: string },
  Args = entityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars["String"];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext & { chainName: string },
  Args = subgraphIdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars["String"];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext & { chainName: string },
  Args = derivedFromDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  account?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<QueryaccountArgs, "id" | "subgraphError">
  >;
  accounts?: Resolver<
    Array<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<QueryaccountsArgs, "skip" | "first" | "subgraphError">
  >;
  accountVolumeByPair?: Resolver<
    Maybe<ResolversTypes["AccountVolumeByPair"]>,
    ParentType,
    ContextType,
    RequireFields<QueryaccountVolumeByPairArgs, "id" | "subgraphError">
  >;
  accountVolumeByPairs?: Resolver<
    Array<ResolversTypes["AccountVolumeByPair"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryaccountVolumeByPairsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  market?: Resolver<
    Maybe<ResolversTypes["Market"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymarketArgs, "id" | "subgraphError">
  >;
  markets?: Resolver<
    Array<ResolversTypes["Market"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymarketsArgs, "skip" | "first" | "subgraphError">
  >;
  offer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<QueryofferArgs, "id" | "subgraphError">
  >;
  offers?: Resolver<
    Array<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<QueryoffersArgs, "skip" | "first" | "subgraphError">
  >;
  order?: Resolver<
    Maybe<ResolversTypes["Order"]>,
    ParentType,
    ContextType,
    RequireFields<QueryorderArgs, "id" | "subgraphError">
  >;
  orders?: Resolver<
    Array<ResolversTypes["Order"]>,
    ParentType,
    ContextType,
    RequireFields<QueryordersArgs, "skip" | "first" | "subgraphError">
  >;
  limitOrder?: Resolver<
    Maybe<ResolversTypes["LimitOrder"]>,
    ParentType,
    ContextType,
    RequireFields<QuerylimitOrderArgs, "id" | "subgraphError">
  >;
  limitOrders?: Resolver<
    Array<ResolversTypes["LimitOrder"]>,
    ParentType,
    ContextType,
    RequireFields<QuerylimitOrdersArgs, "skip" | "first" | "subgraphError">
  >;
  kandelDepositWithdraw?: Resolver<
    Maybe<ResolversTypes["KandelDepositWithdraw"]>,
    ParentType,
    ContextType,
    RequireFields<QuerykandelDepositWithdrawArgs, "id" | "subgraphError">
  >;
  kandelDepositWithdraws?: Resolver<
    Array<ResolversTypes["KandelDepositWithdraw"]>,
    ParentType,
    ContextType,
    RequireFields<
      QuerykandelDepositWithdrawsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  kandel?: Resolver<
    Maybe<ResolversTypes["Kandel"]>,
    ParentType,
    ContextType,
    RequireFields<QuerykandelArgs, "id" | "subgraphError">
  >;
  kandels?: Resolver<
    Array<ResolversTypes["Kandel"]>,
    ParentType,
    ContextType,
    RequireFields<QuerykandelsArgs, "skip" | "first" | "subgraphError">
  >;
  kandelPopulateRetract?: Resolver<
    Maybe<ResolversTypes["KandelPopulateRetract"]>,
    ParentType,
    ContextType,
    RequireFields<QuerykandelPopulateRetractArgs, "id" | "subgraphError">
  >;
  kandelPopulateRetracts?: Resolver<
    Array<ResolversTypes["KandelPopulateRetract"]>,
    ParentType,
    ContextType,
    RequireFields<
      QuerykandelPopulateRetractsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  kandelParameters?: Resolver<
    Array<ResolversTypes["KandelParameters"]>,
    ParentType,
    ContextType,
    RequireFields<QuerykandelParametersArgs, "skip" | "first" | "subgraphError">
  >;
  orderStack?: Resolver<
    Maybe<ResolversTypes["OrderStack"]>,
    ParentType,
    ContextType,
    RequireFields<QueryorderStackArgs, "id" | "subgraphError">
  >;
  orderStacks?: Resolver<
    Array<ResolversTypes["OrderStack"]>,
    ParentType,
    ContextType,
    RequireFields<QueryorderStacksArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: Resolver<
    Maybe<ResolversTypes["_Meta_"]>,
    ParentType,
    ContextType,
    Partial<Query_metaArgs>
  >;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = ResolversObject<{
  account?: SubscriptionResolver<
    Maybe<ResolversTypes["Account"]>,
    "account",
    ParentType,
    ContextType,
    RequireFields<SubscriptionaccountArgs, "id" | "subgraphError">
  >;
  accounts?: SubscriptionResolver<
    Array<ResolversTypes["Account"]>,
    "accounts",
    ParentType,
    ContextType,
    RequireFields<SubscriptionaccountsArgs, "skip" | "first" | "subgraphError">
  >;
  accountVolumeByPair?: SubscriptionResolver<
    Maybe<ResolversTypes["AccountVolumeByPair"]>,
    "accountVolumeByPair",
    ParentType,
    ContextType,
    RequireFields<SubscriptionaccountVolumeByPairArgs, "id" | "subgraphError">
  >;
  accountVolumeByPairs?: SubscriptionResolver<
    Array<ResolversTypes["AccountVolumeByPair"]>,
    "accountVolumeByPairs",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionaccountVolumeByPairsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  market?: SubscriptionResolver<
    Maybe<ResolversTypes["Market"]>,
    "market",
    ParentType,
    ContextType,
    RequireFields<SubscriptionmarketArgs, "id" | "subgraphError">
  >;
  markets?: SubscriptionResolver<
    Array<ResolversTypes["Market"]>,
    "markets",
    ParentType,
    ContextType,
    RequireFields<SubscriptionmarketsArgs, "skip" | "first" | "subgraphError">
  >;
  offer?: SubscriptionResolver<
    Maybe<ResolversTypes["Offer"]>,
    "offer",
    ParentType,
    ContextType,
    RequireFields<SubscriptionofferArgs, "id" | "subgraphError">
  >;
  offers?: SubscriptionResolver<
    Array<ResolversTypes["Offer"]>,
    "offers",
    ParentType,
    ContextType,
    RequireFields<SubscriptionoffersArgs, "skip" | "first" | "subgraphError">
  >;
  order?: SubscriptionResolver<
    Maybe<ResolversTypes["Order"]>,
    "order",
    ParentType,
    ContextType,
    RequireFields<SubscriptionorderArgs, "id" | "subgraphError">
  >;
  orders?: SubscriptionResolver<
    Array<ResolversTypes["Order"]>,
    "orders",
    ParentType,
    ContextType,
    RequireFields<SubscriptionordersArgs, "skip" | "first" | "subgraphError">
  >;
  limitOrder?: SubscriptionResolver<
    Maybe<ResolversTypes["LimitOrder"]>,
    "limitOrder",
    ParentType,
    ContextType,
    RequireFields<SubscriptionlimitOrderArgs, "id" | "subgraphError">
  >;
  limitOrders?: SubscriptionResolver<
    Array<ResolversTypes["LimitOrder"]>,
    "limitOrders",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionlimitOrdersArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  kandelDepositWithdraw?: SubscriptionResolver<
    Maybe<ResolversTypes["KandelDepositWithdraw"]>,
    "kandelDepositWithdraw",
    ParentType,
    ContextType,
    RequireFields<SubscriptionkandelDepositWithdrawArgs, "id" | "subgraphError">
  >;
  kandelDepositWithdraws?: SubscriptionResolver<
    Array<ResolversTypes["KandelDepositWithdraw"]>,
    "kandelDepositWithdraws",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionkandelDepositWithdrawsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  kandel?: SubscriptionResolver<
    Maybe<ResolversTypes["Kandel"]>,
    "kandel",
    ParentType,
    ContextType,
    RequireFields<SubscriptionkandelArgs, "id" | "subgraphError">
  >;
  kandels?: SubscriptionResolver<
    Array<ResolversTypes["Kandel"]>,
    "kandels",
    ParentType,
    ContextType,
    RequireFields<SubscriptionkandelsArgs, "skip" | "first" | "subgraphError">
  >;
  kandelPopulateRetract?: SubscriptionResolver<
    Maybe<ResolversTypes["KandelPopulateRetract"]>,
    "kandelPopulateRetract",
    ParentType,
    ContextType,
    RequireFields<SubscriptionkandelPopulateRetractArgs, "id" | "subgraphError">
  >;
  kandelPopulateRetracts?: SubscriptionResolver<
    Array<ResolversTypes["KandelPopulateRetract"]>,
    "kandelPopulateRetracts",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionkandelPopulateRetractsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  kandelParameters?: SubscriptionResolver<
    Array<ResolversTypes["KandelParameters"]>,
    "kandelParameters",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionkandelParametersArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  orderStack?: SubscriptionResolver<
    Maybe<ResolversTypes["OrderStack"]>,
    "orderStack",
    ParentType,
    ContextType,
    RequireFields<SubscriptionorderStackArgs, "id" | "subgraphError">
  >;
  orderStacks?: SubscriptionResolver<
    Array<ResolversTypes["OrderStack"]>,
    "orderStacks",
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionorderStacksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  _meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "_meta",
    ParentType,
    ContextType,
    Partial<Subscription_metaArgs>
  >;
}>;

export type AccountResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Account"] = ResolversParentTypes["Account"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  address?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  latestInteractionDate?: Resolver<
    ResolversTypes["BigInt"],
    ParentType,
    ContextType
  >;
  volumes?: Resolver<
    Array<ResolversTypes["AccountVolumeByPair"]>,
    ParentType,
    ContextType,
    RequireFields<AccountvolumesArgs, "skip" | "first">
  >;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountVolumeByPairResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["AccountVolumeByPair"] = ResolversParentTypes["AccountVolumeByPair"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  account?: Resolver<ResolversTypes["Account"], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  token0Sent?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token0Received?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token1Sent?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token1Received?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export type KandelResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Kandel"] = ResolversParentTypes["Kandel"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  seeder?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  address?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  base?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  quote?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  deployer?: Resolver<ResolversTypes["Account"], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes["Account"], ParentType, ContextType>;
  reserveId?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  router?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  depositedBase?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  depositedQuote?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gasprice?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  gasreq?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  compoundRateBase?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  compoundRateQuote?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  spread?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  ratio?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  offerIndexes?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  offers?: Resolver<
    Array<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<KandeloffersArgs, "skip" | "first">
  >;
  depositWithdraws?: Resolver<
    Array<ResolversTypes["KandelDepositWithdraw"]>,
    ParentType,
    ContextType,
    RequireFields<KandeldepositWithdrawsArgs, "skip" | "first">
  >;
  parameters?: Resolver<
    Array<ResolversTypes["KandelParameters"]>,
    ParentType,
    ContextType,
    RequireFields<KandelparametersArgs, "skip" | "first">
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type KandelDepositWithdrawResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["KandelDepositWithdraw"] = ResolversParentTypes["KandelDepositWithdraw"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  isDeposit?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  kandel?: Resolver<ResolversTypes["Kandel"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type KandelParametersResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["KandelParameters"] = ResolversParentTypes["KandelParameters"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gasprice?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  gasreq?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  compoundRateBase?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  compoundRateQuote?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  spread?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  ratio?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  kandel?: Resolver<ResolversTypes["Kandel"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type KandelPopulateRetractResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["KandelPopulateRetract"] = ResolversParentTypes["KandelPopulateRetract"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  startLogIndex?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  isRetract?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  offerGives?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  kandel?: Resolver<ResolversTypes["Kandel"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LimitOrderResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["LimitOrder"] = ResolversParentTypes["LimitOrder"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  latestUpdateDate?: Resolver<
    ResolversTypes["BigInt"],
    ParentType,
    ContextType
  >;
  wants?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gives?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  expiryDate?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  fillWants?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  fillOrKill?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  restingOrder?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  realTaker?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType
  >;
  offer?: Resolver<Maybe<ResolversTypes["Offer"]>, ParentType, ContextType>;
  isOpen?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Market"] = ResolversParentTypes["Market"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  outbound_tkn?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  inbound_tkn?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  active?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  gasbase?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OfferResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Offer"] = ResolversParentTypes["Offer"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  latestTransactionHash?: Resolver<
    ResolversTypes["Bytes"],
    ParentType,
    ContextType
  >;
  latestLogIndex?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  latestUpdateDate?: Resolver<
    ResolversTypes["BigInt"],
    ParentType,
    ContextType
  >;
  offerId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  wants?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gives?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gasprice?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gasreq?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  gasBase?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  prev?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  isOpen?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  isFailed?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  isFilled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  isRetracted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  failedReason?: Resolver<
    Maybe<ResolversTypes["Bytes"]>,
    ParentType,
    ContextType
  >;
  posthookFailReason?: Resolver<
    Maybe<ResolversTypes["Bytes"]>,
    ParentType,
    ContextType
  >;
  deprovisioned?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  totalGot?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  totalGave?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  prevGives?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  prevWants?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  market?: Resolver<ResolversTypes["Market"], ParentType, ContextType>;
  maker?: Resolver<ResolversTypes["Account"], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes["Account"]>, ParentType, ContextType>;
  kandel?: Resolver<Maybe<ResolversTypes["Kandel"]>, ParentType, ContextType>;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["Order"] = ResolversParentTypes["Order"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  taker?: Resolver<Maybe<ResolversTypes["Account"]>, ParentType, ContextType>;
  takerGot?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  takerGave?: Resolver<
    Maybe<ResolversTypes["BigInt"]>,
    ParentType,
    ContextType
  >;
  penalty?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  feePaid?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  market?: Resolver<Maybe<ResolversTypes["Market"]>, ParentType, ContextType>;
  limitOrder?: Resolver<
    Maybe<ResolversTypes["LimitOrder"]>,
    ParentType,
    ContextType
  >;
  chainName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderStackResolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["OrderStack"] = ResolversParentTypes["OrderStack"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ids?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  last?: Resolver<Maybe<ResolversTypes["Order"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"]
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext & { chainName: string },
  ParentType extends ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"]
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext & { chainName: string }> =
  ResolversObject<{
    Query?: QueryResolvers<ContextType>;
    Subscription?: SubscriptionResolvers<ContextType>;
    Account?: AccountResolvers<ContextType>;
    AccountVolumeByPair?: AccountVolumeByPairResolvers<ContextType>;
    BigDecimal?: GraphQLScalarType;
    BigInt?: GraphQLScalarType;
    Bytes?: GraphQLScalarType;
    Kandel?: KandelResolvers<ContextType>;
    KandelDepositWithdraw?: KandelDepositWithdrawResolvers<ContextType>;
    KandelParameters?: KandelParametersResolvers<ContextType>;
    KandelPopulateRetract?: KandelPopulateRetractResolvers<ContextType>;
    LimitOrder?: LimitOrderResolvers<ContextType>;
    Market?: MarketResolvers<ContextType>;
    Offer?: OfferResolvers<ContextType>;
    Order?: OrderResolvers<ContextType>;
    OrderStack?: OrderStackResolvers<ContextType>;
    _Block_?: _Block_Resolvers<ContextType>;
    _Meta_?: _Meta_Resolvers<ContextType>;
  }>;

export type DirectiveResolvers<
  ContextType = MeshContext & { chainName: string }
> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = MangroveTypes.Context & BaseMeshContext;

const baseDir = pathModule.join(
  typeof __dirname === "string" ? __dirname : "/",
  ".."
);

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId)
      ? pathModule.relative(baseDir, moduleId)
      : moduleId
  )
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/Mangrove/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(
        new Error(`Cannot find module '${relativeModuleId}'.`)
      );
  }
};

const rootStore = new MeshStore(
  ".graphclient",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  }
);

export const rawServeConfig: YamlConfig.Config["serve"] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child("sources");
  const logger = new DefaultLogger("GraphClient");
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child("cache"),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const mangroveTransforms = [];
  const mangroveHandler = new GraphqlHandler({
    name: "Mangrove",
    config: {
      endpoint:
        "https://mangrove-api-proxy-466fefe29e0a.herokuapp.com/mangrove-subgraph/v0.0.6-analytics/{context.chainName:matic}",
    },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("Mangrove"),
    logger: logger.child("Mangrove"),
    importFn,
  });
  const additionalTypeDefs = [
    parse(
      "extend type Market {\n  chainName: String!\n}\n\nextend type Account {\n  chainName: String!\n}\n\nextend type Order {\n  chainName: String!\n}\n\nextend type LimitOrder {\n  chainName: String!\n}\n\nextend type Offer {\n  chainName: String!\n}\n\nextend type AccountVolumeByPair {\n  chainName: String!\n}"
    ),
  ] as any[];
  mangroveTransforms[0] = new AutoPaginationTransform({
    apiName: "Mangrove",
    config: null,
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  sources[0] = {
    name: "Mangrove",
    handler: mangroveHandler,
    transforms: mangroveTransforms,
  };
  const additionalResolvers = await Promise.all([
    import("../src/resolvers.js").then((m) => m.resolvers || m.default || m),
  ]);
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child("bareMerger"),
    store: rootStore.child("bareMerger"),
  });

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
        {
          document: GetVolumesDocument,
          get rawSDL() {
            return printWithCache(GetVolumesDocument);
          },
          location: "GetVolumesDocument.graphql",
        },
      ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<
  TServerContext = {}
>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions()
      .then((meshOptions) => getMesh(meshOptions))
      .then((mesh) => {
        const id = mesh.pubsub.subscribe("destroy", () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) =>
  getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(
  globalContext?: TGlobalContext
) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) =>
    sdkRequesterFactory(globalContext)
  );
  return getSdk<TOperationContext, TGlobalContext>((...args) =>
    sdkRequester$.then((sdkRequester) => sdkRequester(...args))
  );
}
export type getVolumesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  latestDate?: InputMaybe<Scalars["BigInt"]>;
}>;

export type getVolumesQuery = {
  accountVolumeByPairs: Array<
    Pick<
      AccountVolumeByPair,
      | "id"
      | "updatedDate"
      | "token0"
      | "token1"
      | "token0Sent"
      | "token0Received"
      | "token1Sent"
      | "token1Received"
    > & { account: Pick<Account, "id" | "address"> }
  >;
};

export const getVolumesDocument = gql`
  query getVolumes($first: Int, $skip: Int, $latestDate: BigInt) {
    accountVolumeByPairs(
      first: $first
      skip: $skip
      orderBy: updatedDate
      orderDirection: asc
      where: { updatedDate_gt: $latestDate }
    ) {
      id
      account {
        id
        address
      }
      updatedDate
      token0
      token1
      token0Sent
      token0Received
      token1Sent
      token1Received
    }
  }
` as unknown as DocumentNode<getVolumesQuery, getVolumesQueryVariables>;

export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getVolumes(
      variables?: getVolumesQueryVariables,
      options?: C
    ): Promise<getVolumesQuery> {
      return requester<getVolumesQuery, getVolumesQueryVariables>(
        getVolumesDocument,
        variables,
        options
      ) as Promise<getVolumesQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
