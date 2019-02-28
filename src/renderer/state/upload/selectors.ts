import { uniq, values } from "lodash";
import { createSelector } from "reselect";

import { State } from "../types";
import { UploadStateBranch } from "./types";

export const getUpload = (state: State) => state.upload;

export const getWellIdToFiles = createSelector([getUpload], (upload: UploadStateBranch) => {
    const wellIdToFilesMap = new Map<number, string[]>();
    for (const fullPath in upload) {
        if (upload.hasOwnProperty(fullPath)) {
            const metadata = upload[fullPath];

            if (wellIdToFilesMap.has(metadata.wellId)) {
                const files: string[] = wellIdToFilesMap.get(metadata.wellId) || [];
                files.push(fullPath);
                wellIdToFilesMap.set(metadata.wellId, uniq(files));
            } else {
                wellIdToFilesMap.set(metadata.wellId, [fullPath]);
            }
        }
    }

    return wellIdToFilesMap;
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
