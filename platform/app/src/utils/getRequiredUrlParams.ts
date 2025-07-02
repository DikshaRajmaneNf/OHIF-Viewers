import { extractUrlParams } from '../../../../extensions/default/src/utils/extractUrlParams';
import { TUrlParams } from '../types';

const REQUIRED_KEYS = {
  viewmode: 'viewMode',
  rightpanelclosed: 'rightPanelClosed',
  leftpanelclosed: 'leftPanelClosed',
};

export function getRequiredUrlParams(): TUrlParams {
  return extractUrlParams(Object.keys(REQUIRED_KEYS), REQUIRED_KEYS);
}
