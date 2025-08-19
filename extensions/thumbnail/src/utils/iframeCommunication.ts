/**
 * Utility functions for iframe communication with parent application
 */

export interface IframeMessage {
  type: string;
  payload?: any;
  source: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Check if the current window is inside an iframe
 */
export const isInIframe = (): boolean => {
  try {
    return window.parent !== window;
  } catch (error) {
    // If we can't access window.parent due to cross-origin restrictions,
    // we're likely in an iframe
    return true;
  }
};

/**
 * Send a message to the parent application via iframe
 */
export const sendMessageToParent = (message: Omit<IframeMessage, 'source'>): void => {
  console.log('thumbnail sendMessageToParent', message);

  try {
    if (isInIframe()) {
      const fullMessage: IframeMessage = {
        ...message,
        source: 'ohif-viewer',
      };

      window.parent.postMessage(fullMessage, '*');

      console.log('Sent iframe message to parent:', fullMessage);
    } else {
      console.log('Not in an iframe, skipping parent communication');
    }
  } catch (error) {
    console.error('Error sending iframe message:', error);
  }
};

/**
 * Listen for messages from parent application
 */
export const listenToParentMessages = (
  callback: (message: any, origin: string) => void
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    callback(event.data, event.origin);
  };

  window.addEventListener('message', messageHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageHandler);
  };
};

/**
 * Send thumbnail double-click event to parent application
 */
export const triggerSeriesThumbnailClick = (seriesInstanceUID?: string): void => {
  sendMessageToParent({
    type: 'SERIES_THUMBNAIL_CLICK',
    payload: {
      seriesInstanceUID,
    },
  });
};
