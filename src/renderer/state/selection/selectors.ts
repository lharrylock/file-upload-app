import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import { State } from "../types";

import { UploadFile } from "./types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State): string[] => state.selection.files;
export const getStagedFiles = (state: State) => state.selection.stagedFiles;

// COMPLEX SELECTORS
export const hasStagedFiles = createSelector([getStagedFiles], (files: UploadFile[]): boolean => {
    return !isEmpty(files);
});
