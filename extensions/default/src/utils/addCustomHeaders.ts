import { utils } from '@ohif/core';
import { DicomWebConfig } from '../DicomWebDataSource';

const { getSplitParam } = utils;

export type TCustomHeaders = {
  'dav-dataset-id'?: string;
  'dav-for-user'?: string;
  'dav-series-filter'?: string;
  'dav-instance-id'?: string;
  'dav-patient-id'?: string;
  'dav-modality'?: string;
};

function getUrlParams(): TCustomHeaders {
  const params = new URLSearchParams(window.location.search);

  const datasetId = getSplitParam('datasetid', params)?.[0];
  const forUser = getSplitParam('foruser', params)?.[0];
  const seriesId = getSplitParam('seriesid', params)?.[0];
  const instanceId = getSplitParam('instanceid', params)?.[0];
  const patientId = getSplitParam('patientid', params)?.[0];
  const modality = getSplitParam('modality', params)?.[0];

  const urlParams = {
    ...(datasetId && { 'dav-dataset-id': datasetId }),
    ...(forUser && { 'dav-for-user': forUser }),
    ...(seriesId && { 'dav-series-filter': seriesId }),
    ...(instanceId && { 'dav-instance-id': instanceId }),
    ...(patientId && { 'dav-patient-id': patientId }),
    ...(modality && { 'dav-modality': modality }),
  };

  return urlParams;
}

export function withParams(config: DicomWebConfig): DicomWebConfig {
  if (!config) {
    return config;
  }

  return {
    ...config,
    enableStudyLazyLoad: false,
    customHeaders: getUrlParams(),
  };
}
