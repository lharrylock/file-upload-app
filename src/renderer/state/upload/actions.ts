import { ASSOCIATE_FILES_AND_WELL, CLEAR_UPLOAD, UNDO_FILE_WELL_ASSOCIATION } from "./constants";
import { AssociateFilesAndWellAction, ClearUploadAction, UndoFileWellAssociationAction } from "./types";

export function associateFilesAndWell(fullPaths: string[], wellId: number)
    : AssociateFilesAndWellAction {
    return {
        payload: {
            fullPaths,
            wellId,
        },
        type: ASSOCIATE_FILES_AND_WELL,
    };
}

export function undoFileWellAssociation(fullPath: string): UndoFileWellAssociationAction {
    return {
        payload: fullPath,
        type: UNDO_FILE_WELL_ASSOCIATION,
    };
}

export function clearUpload(): ClearUploadAction {
    return {
        type: CLEAR_UPLOAD,
    };
}
