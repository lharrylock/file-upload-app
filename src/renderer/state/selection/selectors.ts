import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State): string[] => state.selection.files;
export const getStagedFiles = (state: State) => state.selection.stagedFiles;

// COMPLEX SELECTORS
