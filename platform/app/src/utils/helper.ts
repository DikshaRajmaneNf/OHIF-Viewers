import { getSplitParam } from '../../../core/src/utils';
import { TUrlParams } from '../types';

export function getAllUrlParams(): TUrlParams {
  const params = new URLSearchParams(window.location.search);

  const viewMode = getSplitParam('viewmode', params)?.[0];

  return {
    viewMode,
  };
}
