import { utils } from '@ohif/core';
import { DicomWebConfig } from '../DicomWebDataSource';

const { getSplitParam } = utils;

export function getUrlParams() {
  const params = new URLSearchParams(window.location.search);

  const datasetId = getSplitParam('datasetid', params);

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
    datasetId: String(getUrlParams().datasetId),
  };
}
