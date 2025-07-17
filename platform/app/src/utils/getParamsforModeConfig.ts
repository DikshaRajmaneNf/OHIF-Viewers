import { TCustomModeConfig, TUrlParams } from '../types';

export function getCustomModeConfig(params: TUrlParams): TCustomModeConfig {
  return {
    viewMode: String(params.viewMode).toLowerCase() === 'true',
    ...(params.rightPanelClosed && {
      rightPanelClosed: String(params.rightPanelClosed).toLowerCase() === 'true',
    }),
    ...(params.leftPanelClosed && {
      leftPanelClosed: String(params.leftPanelClosed).toLowerCase() === 'true',
    }),
    ...(params.enableThumbnailView && {
      enableThumbnailView: String(params.enableThumbnailView).toLowerCase() === 'true',
    }),
  };
}
