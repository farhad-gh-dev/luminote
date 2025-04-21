import { createContext } from "react";
import { Highlight } from "./highlight-model";
import { HighlightsThunkAction } from "./highlights-actions";

export interface HighlightsState {
  highlights: Highlight[];
  filter: string | null;
  colorFilter: string | null;
}

export type HighlightsAction =
  | { type: "DELETE_HIGHLIGHT"; payload: { id: string } }
  | { type: "ADD_HIGHLIGHT"; payload: { highlight: Highlight } }
  | { type: "SET_HIGHLIGHTS"; payload: { highlights: Highlight[] } }
  | { type: "SET_FILTER"; payload: { filter: string | null } }
  | { type: "SET_COLOR_FILTER"; payload: { colorFilter: string | null } };

export type HighlightsDispatch = (
  action: HighlightsAction | HighlightsThunkAction
) => void;

export const initialHighlightsState: HighlightsState = {
  highlights: [],
  filter: null,
  colorFilter: null,
};

export function highlightsReducer(
  state: HighlightsState,
  action: HighlightsAction
): HighlightsState {
  switch (action.type) {
    case "DELETE_HIGHLIGHT":
      return {
        ...state,
        highlights: state.highlights.filter(
          (highlight) => highlight.id !== action.payload.id
        ),
      };
    case "ADD_HIGHLIGHT":
      return {
        ...state,
        highlights: [...state.highlights, action.payload.highlight],
      };
    case "SET_HIGHLIGHTS":
      return {
        ...state,
        highlights: action.payload.highlights,
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload.filter,
      };
    case "SET_COLOR_FILTER":
      return {
        ...state,
        colorFilter: action.payload.colorFilter,
      };
    default:
      return state;
  }
}

export const thunkMiddleware = (
  dispatch: React.Dispatch<HighlightsAction>,
  getState: () => HighlightsState
): HighlightsDispatch => {
  return (action: HighlightsAction | HighlightsThunkAction) => {
    // If action is a function (thunk), execute it with dispatch and getState
    if (typeof action === "function") {
      return action(
        (actionOrThunk) => thunkMiddleware(dispatch, getState)(actionOrThunk),
        getState
      );
    }

    // Otherwise, dispatch the action directly
    return dispatch(action);
  };
};

export interface HighlightsContextType {
  state: HighlightsState;
  dispatch: HighlightsDispatch;
}

export const HighlightsContext = createContext<
  HighlightsContextType | undefined
>(undefined);
