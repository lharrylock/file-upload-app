import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "../types";
import { UploadStateBranch } from "./types";

export const getUpload = (state: State) => state.upload;

export const getWellIdToFileCount = createSelector([getUpload], (upload: UploadStateBranch) => {
    const wellIdToFileCountMap = new Map<number, number>();
    for (const fullPath in upload) {
        if (upload.hasOwnProperty(fullPath)) {
            const metadata = upload[fullPath];

            if (wellIdToFileCountMap.has(metadata.wellId)) {
                const count = wellIdToFileCountMap.get(metadata.wellId) || 1;
                wellIdToFileCountMap.set(metadata.wellId, count + 1);
            } else {
                wellIdToFileCountMap.set(metadata.wellId, 1);
            }
        }
    }

    return wellIdToFileCountMap;
});

export const getFileToMetadataCount = createSelector([getUpload], (upload: UploadStateBranch) => {
    const fullPathToMetadataCount = new Map<string, number>();
    for (const fullPath in upload) {
        if (upload.hasOwnProperty(fullPath)) {
            const metadata = upload[fullPath];

            const count = values(metadata).reduce((accum: number, next: any) => {
                if (next !== undefined) {
                    accum++;
                }

                return accum;
            }, 0);

            fullPathToMetadataCount.set(fullPath, count);
        }
    }
    return fullPathToMetadataCount;
});
