import { utils } from '@ohif/core';
import { DicomWebConfig } from '../DicomWebDataSource';

const { getSplitParam } = utils;

export type TCustomHeaders = {
  'x-dataset-id'?: string;
  'for-user'?: string;
  'series-filter'?: string;
};

function getUrlParams(): TCustomHeaders {
  const params = new URLSearchParams(window.location.search);

  const datasetId = getSplitParam('datasetid', params)?.[0];
  const forUser = getSplitParam('foruser', params)?.[0];
  const seriesId = getSplitParam('seriesid', params)?.[0];

  const urlParams = {
    ...(datasetId && { 'x-dataset-id': datasetId }),
    ...(forUser && { 'for-user': forUser }),
    ...(seriesId && { 'series-filter': seriesId }),
  };

  return urlParams;
}

export function withParams(config: DicomWebConfig): DicomWebConfig {
  if (!config) {
    return config;
  }

  return {
    ...config,
    customHeaders: getUrlParams(),
  };
}
