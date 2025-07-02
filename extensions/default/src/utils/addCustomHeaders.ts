import { DicomWebConfig } from '../DicomWebDataSource';
import { extractUrlParams } from './extractUrlParams';

export type TCustomHeaders = {
  'dav-dataset-id'?: string;
  'dav-for-user'?: string;
  'dav-study-id'?: string;
  'dav-series-filter'?: string;
  'dav-instance-id'?: string;
  'dav-patient-id'?: string;
  'dav-modality'?: string;
};

const HEADER_KEYS = {
  datasetid: 'dav-dataset-id',
  foruser: 'dav-for-user',
  studyinstanceuids: 'dav-study-id',
  seriesid: 'dav-series-filter',
  instanceid: 'dav-instance-id',
  patientid: 'dav-patient-id',
  modality: 'dav-modality',
};

export function withParams(config: DicomWebConfig): DicomWebConfig {
  if (!config) {
    return config;
  }

  return {
    ...config,
    customHeaders: extractUrlParams(Object.keys(HEADER_KEYS), HEADER_KEYS),
  };
}
