import { ASSOCIATE_FILES_AND_WELL, JUMP_TO_PAST_UPLOAD, JUMP_TO_UPLOAD, UNDO_FILE_WELL_ASSOCIATION } from "./constants";
import {
    AssociateFilesAndWellAction,
    JumpToPastUploadAction,
    JumpToUploadAction,
    UndoFileWellAssociationAction
} from "./types";

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
