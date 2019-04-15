import { Uploads } from "@aics/aicsfiles/type-declarations/types";
import { isEmpty, map, uniq } from "lodash";
import { extname } from "path";
import { createSelector } from "reselect";

import { State } from "../types";
import { UploadJobTableRow, UploadMetadata, UploadStateBranch } from "./types";

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

export const getUploadSummaryRows = createSelector([getUpload], (uploads: UploadStateBranch): UploadJobTableRow[] =>
    map(uploads, ({ barcode, wellLabel}: UploadMetadata, fullPath: string) => ({
        barcode,
        file: fullPath,
        key: fullPath,
        wellLabel,
    }))
);

export class FileType {
    public static readonly IMAGE = "image";
    public static readonly OTHER = "other";
}

const fileTypeToExtensionMap = new Map<string, string[]>([
    [FileType.IMAGE, [".czi", ".ome.tif", ".ome.tiff", ".tiff", ".png", ".pdf"]],
]);

const extensionToFileTypeMap = new Map();
fileTypeToExtensionMap.forEach((extensions: string[], fileType: string) => {
    extensions.forEach((ext) => extensionToFileTypeMap.set(ext, fileType));
});

const getFileType = (fullpath: string): string => {
    return extensionToFileTypeMap.get(extname(fullpath)) || FileType.OTHER;
};

export const getUploadPayload = createSelector([getUpload], (uploads: UploadStateBranch): Uploads => {
    let result = {};
    map(uploads, ({wellId}: UploadMetadata, fullPath: string) => {
        result = {
            ...result,
            [fullPath]: {
                file: {
                    fileType: getFileType(fullPath),
                },
                microscopy: {
                    wellId,
                },
            },
        };
    });

    return result;
});
