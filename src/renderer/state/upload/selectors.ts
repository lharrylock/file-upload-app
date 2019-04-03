import { isEmpty, map, uniq } from "lodash";
import { createSelector } from "reselect";
import { Uploads } from "../../../main/file-storage-service-client/types";

import { State } from "../types";
import { UploadMetadata, UploadStateBranch, UploadTableRow } from "./types";

export const getUpload = (state: State) => state.upload.present;
export const getCurrentUploadIndex = (state: State) => state.upload.index;
export const getUploadPast = (state: State) => state.upload.past;
export const getUploadFuture = (state: State) => state.upload.future;

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

export const getCanRedoUpload = createSelector([getUploadFuture], (future: UploadStateBranch[]) => {
    return !isEmpty(future);
});

export const getCanUndoUpload = createSelector([getUploadPast], (past: UploadStateBranch[]) => {
    return !isEmpty(past);
});

export const getUploadSummaryRows = createSelector([getUpload], (uploads: UploadStateBranch): UploadTableRow[] =>
    map(uploads, ({ barcode, wellLabel}: UploadMetadata, fullPath: string) => ({
        barcode,
        file: fullPath,
        key: fullPath,
        wellLabel,
    }))
);

export const getUploadPayload = createSelector([getUpload], (uploads: UploadStateBranch): Uploads => {
    let result = {};
    map(uploads, ({wellId}: UploadMetadata, fullPath: string) => {
        result = {
            ...result,
            [fullPath]: {
                fileType: "text", // todo
                microscopy: {
                    wellId,
                },
            },
        };
    });

    return result;
});
