import {
    ASSOCIATE_FILES_AND_WELL,
    CLEAR_UPLOAD_HISTORY,
    DELETE_UPLOAD,
    INITIATE_UPLOAD,
    JUMP_TO_PAST_UPLOAD,
    JUMP_TO_UPLOAD,
    UNDO_FILE_WELL_ASSOCIATION
} from "./constants";
import {
    AssociateFilesAndWellAction,
    ClearUploadHistoryAction,
    DeleteUploadsAction, InitiateUploadAction,
    JumpToPastUploadAction,
    JumpToUploadAction,
    UndoFileWellAssociationAction
} from "./types";

export function associateFilesAndWell(fullPaths: string[], wellId: number)
    : AssociateFilesAndWellAction {
    return {
        payload: {
            barcode: "",
            fullPaths,
            wellId,
            wellLabel: "",
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

export function deleteUpload(fullPaths: string[]): DeleteUploadsAction {
    return {
        payload: fullPaths,
        type: DELETE_UPLOAD,
    };
}

export function initiateUpload(): InitiateUploadAction {
    return {
        type: INITIATE_UPLOAD,
    };
}
