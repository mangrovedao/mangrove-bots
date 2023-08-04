import { Resolvers } from "../.graphclient";

export const resolvers: Resolvers = {
  Market: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
  Account: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
  Order: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
  LimitOrder: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
  Offer: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
  AccountVolumeByPair: {
    chainName: (root, args, context, info) => context.chainName || "matic", // The value we provide in the config
  },
};
