import { utils } from '@ohif/core';
import { DicomWebConfig, Tdataset } from '../DicomWebDataSource';

const { getSplitParam } = utils;

export type Tparams = {
  datasetId: Tdataset;
};

export function getUrlParams(): Tparams {
  const params = new URLSearchParams(window.location.search);

  const datasetIdParam = getSplitParam('datasetid', params);
  let datasetId = null;
  if (datasetIdParam?.length) {
    datasetId = datasetIdParam[0];
  }

  return {
    datasetId,
  };
}

export function withParams(config: DicomWebConfig): DicomWebConfig {
  if (!config) {
    return config;
  }

  return {
    ...config,
    datasetId: getUrlParams().datasetId,
  };
}
