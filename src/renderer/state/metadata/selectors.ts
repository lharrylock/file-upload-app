import { State } from "../types";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getUnits = (state: State) => state.metadata.units;
export const getSelectionHistoryMap = (state: State) => state.metadata.history.selection;
export const getUploadHistoryMap = (state: State) => state.metadata.history.upload;

// COMPOSED SELECTORS
