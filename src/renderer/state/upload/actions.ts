import {
    ASSOCIATE_FILES_AND_WELL,
    CLEAR_UPLOAD_HISTORY,
    JUMP_TO_PAST_UPLOAD,
    JUMP_TO_UPLOAD,
    UNDO_FILE_WELL_ASSOCIATION
} from "./constants";
import {
    AssociateFilesAndWellAction,
    ClearUploadHistoryAction,
    JumpToPastUploadAction,
    JumpToUploadAction,
    UndoFileWellAssociationAction
} from "./types";

export function associateFilesAndWell(fullPaths: string[], wellId: number, wellLabel: string, barcode: string)
    : AssociateFilesAndWellAction {
    return {
        payload: {
            barcode,
            fullPaths,
            wellId,
            wellLabel,
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

export function jumpToPastUpload(index: number): JumpToPastUploadAction {
    return {
        index,
        type: JUMP_TO_PAST_UPLOAD,
    };
}

export function jumpToUpload(index: number): JumpToUploadAction {
    return {
        index,
        type: JUMP_TO_UPLOAD,
    };
}

export function clearUploadHistory(): ClearUploadHistoryAction {
    return {
        type: CLEAR_UPLOAD_HISTORY,
    };
}
