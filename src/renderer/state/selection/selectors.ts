import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import { AppStatus, State } from "../types";

import { UploadFile } from "./types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State): string[] => state.selection.files;
export const getStagedFiles = (state: State) => state.selection.stagedFiles;

// COMPLEX SELECTORS
export const getAppStatus = createSelector([
    getStagedFiles,
], (stagedFiles: UploadFile[]): AppStatus => {
    if (isEmpty(stagedFiles)) {
        return AppStatus.NeedsStagedFiles;
    }
    // todo need a way to return uploading sstatus
    return AppStatus.CreatingMetadata;
});
