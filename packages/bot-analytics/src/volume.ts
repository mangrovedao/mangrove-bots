import { GetParamsVolumes } from "./types";
import { Sdk } from "../.graphclient/index";

export const getVolumes = async (sdk: Sdk, params: GetParamsVolumes) => {
  const result = await sdk.getVolumes({
    first: params.first,
    skip: params.skip,
    latestDate: Math.round(params.latestDate.getTime() / 1000),
  });

  return result;
};
