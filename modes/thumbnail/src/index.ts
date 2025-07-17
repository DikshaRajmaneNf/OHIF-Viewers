import { hotkeys } from '@ohif/core';
import i18n from 'i18next';
import { id } from './id';
import initToolGroups from './initToolGroups';
import toolbarButtons from './toolbarButtons';
import moreTools from './moreTools';
import { TUrlParams, TCustomModeConfig } from '../../../platform/app/src/types';

// Allow this mode by excluding non-imaging modalities such as SR, SEG
// Also, SM is not a simple imaging modalities, so exclude it.
const NON_IMAGE_MODALITIES = ['ECG', 'SEG', 'RTSTRUCT', 'RTPLAN', 'PR'];

const ohif = {
  layout: '@ohif/extension-thumbnail.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-thumbnail.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-thumbnail.panelModule.seriesList',
  wsiSopClassHandler:
    '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler',
};

const cornerstone = {
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement',
  segmentation: '@ohif/extension-cornerstone.panelModule.panelSegmentation',
};

const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked',
};

const dicomsr = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr',
  sopClassHandler3D: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr-3d',
  viewport: '@ohif/extension-cornerstone-dicom-sr.viewportModule.dicom-sr',
};

const dicomvideo = {
  sopClassHandler: '@ohif/extension-dicom-video.sopClassHandlerModule.dicom-video',
  viewport: '@ohif/extension-dicom-video.viewportModule.dicom-video',
};

const dicompdf = {
  sopClassHandler: '@ohif/extension-dicom-pdf.sopClassHandlerModule.dicom-pdf',
  viewport: '@ohif/extension-dicom-pdf.viewportModule.dicom-pdf',
};

const dicomSeg = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg',
};

const dicomPmap = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-pmap.sopClassHandlerModule.dicom-pmap',
  viewport: '@ohif/extension-cornerstone-dicom-pmap.viewportModule.dicom-pmap',
};

const dicomRT = {
  viewport: '@ohif/extension-cornerstone-dicom-rt.viewportModule.dicom-rt',
  sopClassHandler: '@ohif/extension-cornerstone-dicom-rt.sopClassHandlerModule.dicom-rt',
};

const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-thumbnail': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-measurement-tracking': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-pmap': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-rt': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1',
};

function modeFactory({ modeConfiguration }) {
  let _activatePanelTriggersSubscriptions = [];
  return {
    // TODO: We're using this as a route segment
    // We should not be.
    id,
    routeName: 'thumbnail',
    displayName: i18n.t('Modes:Thumbnail View'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: function ({ servicesManager, extensionManager, commandsManager }: withAppTypes) {
      const { measurementService, toolbarService, toolGroupService, customizationService } =
        servicesManager.services;
    },
    onModeExit: ({ servicesManager }: withAppTypes) => {
      const {
        toolGroupService,
        syncGroupService,
        segmentationService,
        cornerstoneViewportService,
        uiDialogService,
        uiModalService,
      } = servicesManager.services;

      _activatePanelTriggersSubscriptions.forEach(sub => sub.unsubscribe());
      _activatePanelTriggersSubscriptions = [];

      uiDialogService.dismissAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    validationTags: {
      study: [],
      series: [],
    },

    isValidMode: function ({ modalities }) {
      const modalities_list = modalities.split('\\');

      // Exclude non-image modalities
      return {
        valid:
          !!modalities_list.filter(modality => NON_IMAGE_MODALITIES.indexOf(modality) === -1)
            .length && modeConfiguration.enableThumbnailView,
        description:
          'The mode is enabled only for thumbnail views & also does not support studies that ONLY include the following modalities: SM, ECG, SEG, RTSTRUCT',
      };
    },
    routes: [
      {
        path: 'thumbnail',
        /*init: ({ servicesManager, extensionManager }) => {
          //defaultViewerRouteInit
        },*/
        layoutTemplate: () => {
          return {
            id: ohif.layout,
            props: {
              leftPanels: [tracked.thumbnailList],
              leftPanelResizable: true,
              leftPanelClosed: false,
              rightPanels: [],
              rightPanelClosed: true,
              numViewports: 0, // or 1 if you want one empty viewport
              viewports: [
                {
                  namespace: tracked.viewport,
                  displaySetsToDisplay: [
                    // ohif.sopClassHandler,
                    // dicomvideo.sopClassHandler,
                    // dicomsr.sopClassHandler3D,
                    // ohif.wsiSopClassHandler,
                  ],
                },
                // {
                //   namespace: dicomsr.viewport,
                //   displaySetsToDisplay: [dicomsr.sopClassHandler],
                // },
                // {
                //   namespace: dicompdf.viewport,
                //   displaySetsToDisplay: [dicompdf.sopClassHandler],
                // },
                // {
                //   namespace: dicomSeg.viewport,
                //   displaySetsToDisplay: [dicomSeg.sopClassHandler],
                // },
                // {
                //   namespace: dicomPmap.viewport,
                //   displaySetsToDisplay: [dicomPmap.sopClassHandler],
                // },
                // {
                //   namespace: dicomRT.viewport,
                //   displaySetsToDisplay: [dicomRT.sopClassHandler],
                // },
              ],
            },
          };
        },
        // toolGroupIds: [],
        // toolbarButtons: [],
        // panels: {
        //   leftPanels: [
        //     {
        //       id: 'seriesList',
        //       name: 'Series Panel',
        //       icon: 'list-bullets',
        //     },
        //   ],
        //   rightPanels: [], // hide right panel
        // },
        // layoutTemplate: () => {
        //   return {
        //     id: 'empty',
        //     props: {
        //       leftPanels: [tracked.thumbnailList],
        //       leftPanelResizable: true,
        //       leftPanelClosed: modeConfiguration.leftPanelClosed ?? false,
        //       rightPanels: [],
        //       rightPanelClosed: true,
        //       // viewports: [],
        //     },
        //   };
        // },
      },
    ],
    extensions: extensionDependencies,
    // Default protocol gets self-registered by default in the init
    hangingProtocol: 'default',
    // Order is important in sop class handlers when two handlers both use
    // the same sop class under different situations.  In that case, the more
    // general handler needs to come last.  For this case, the dicomvideo must
    // come first to remove video transfer syntax before ohif uses images
    sopClassHandlers: [
      //   dicomvideo.sopClassHandler,
      //   dicomSeg.sopClassHandler,
      //   dicomPmap.sopClassHandler,
      ohif.sopClassHandler,
      //   ohif.wsiSopClassHandler,
      //   dicompdf.sopClassHandler,
      //   dicomsr.sopClassHandler3D,
      //   dicomsr.sopClassHandler,
      //   dicomRT.sopClassHandler,
    ],
    // hotkeys: [...hotkeys.defaults.hotkeyBindings],
    ...modeConfiguration,
  };
}

// function getCustomModeConfig(params: TUrlParams): TCustomModeConfig {
//   return {
//     viewMode: String(params.viewMode).toLowerCase() === 'true',
//     ...(params.rightPanelClosed && {
//       rightPanelClosed: String(params.rightPanelClosed).toLowerCase() === 'true',
//     }),
//     ...(params.leftPanelClosed && {
//       leftPanelClosed: String(params.leftPanelClosed).toLowerCase() === 'true',
//     }),
//   };
// }

const mode = {
  id,
  modeFactory,
  extensionDependencies,
  // getCustomModeConfig,
};

export default mode;
export { initToolGroups, moreTools, toolbarButtons };
