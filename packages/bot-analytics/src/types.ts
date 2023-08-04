export type GetParamsPagination = {
  first: number;
  skip: number;
};

export type GetParamsVolumes = GetParamsPagination & {
  latestDate: Date;
};
