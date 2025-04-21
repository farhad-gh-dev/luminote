import { Highlight } from "./highlight-model";
import {
  HighlightsAction,
  HighlightsDispatch,
  HighlightsState,
} from "./highlights-state";

export type HighlightsThunkAction = (
  dispatch: HighlightsDispatch,
  getState: () => HighlightsState
) => Promise<void> | void;

const sendChromeMessage = async <T>(
  action: string,
  data?: Record<string, unknown>
): Promise<T | undefined> => {
  if (!chrome.runtime?.sendMessage) {
    console.warn("Chrome runtime messaging not available");
    return undefined;
  }

  try {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action, ...data }, (response: T) => {
        if (chrome.runtime.lastError) {
          console.error(
            `Chrome runtime error (${action}):`,
            chrome.runtime.lastError
          );
          resolve(undefined);
        } else {
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error(`Error sending "${action}" message:`, error);
    return undefined;
  }
};

// Regular action creators for highlights
export const highlightsActions = {
  deleteHighlight: (id: string): HighlightsAction => ({
    type: "DELETE_HIGHLIGHT",
    payload: { id },
  }),

  addHighlight: (highlight: Highlight): HighlightsAction => ({
    type: "ADD_HIGHLIGHT",
    payload: { highlight },
  }),

  setHighlights: (highlights: Highlight[]): HighlightsAction => ({
    type: "SET_HIGHLIGHTS",
    payload: { highlights },
  }),

  setFilter: (filter: string | null): HighlightsAction => ({
    type: "SET_FILTER",
    payload: { filter },
  }),

  setColorFilter: (colorFilter: string | null): HighlightsAction => ({
    type: "SET_COLOR_FILTER",
    payload: { colorFilter },
  }),
};

// Thunk action creators for async operations with side effects
export const highlightsThunks = {
  deleteHighlightAndSync:
    (id: string): HighlightsThunkAction =>
    async (dispatch) => {
      // Update local state first for better UX
      dispatch(highlightsActions.deleteHighlight(id));

      // Then sync with Chrome storage
      await sendChromeMessage("deleteHighlight", { id });
    },

  addHighlightAndSync:
    (highlight: Highlight): HighlightsThunkAction =>
    async (dispatch) => {
      // Update local state first for better UX
      dispatch(highlightsActions.addHighlight(highlight));

      // Then sync with Chrome storage
      await sendChromeMessage("saveHighlight", { highlight });
    },

  loadHighlightsFromStorage: (): HighlightsThunkAction => async (dispatch) => {
    const highlights = await sendChromeMessage<Highlight[]>("getHighlights");
    dispatch(highlightsActions.setHighlights(highlights || []));
  },
};
