import React, { useReducer, ReactNode, useCallback, useMemo } from "react";
import { Highlight } from "./highlight-model";
import {
  HighlightsContext,
  highlightsReducer,
  initialHighlightsState,
  thunkMiddleware,
  HighlightsDispatch,
} from "./highlights-state";

// Create a provider component
interface HighlightsProviderProps {
  initialHighlights?: Highlight[];
  children: ReactNode;
}

export const HighlightsProvider: React.FC<HighlightsProviderProps> = ({
  initialHighlights = [],
  children,
}) => {
  // Create initial state with provided highlights
  const [state, dispatchBase] = useReducer(highlightsReducer, {
    ...initialHighlightsState,
    highlights: initialHighlights,
  });

  // Create a function to get the current state (for thunks)
  const getState = useCallback(() => state, [state]);

  // Create enhanced dispatch function with thunk support
  const dispatch = useMemo<HighlightsDispatch>(
    () => thunkMiddleware(dispatchBase, getState),
    [dispatchBase, getState]
  );

  return (
    <HighlightsContext.Provider value={{ state, dispatch }}>
      {children}
    </HighlightsContext.Provider>
  );
};
