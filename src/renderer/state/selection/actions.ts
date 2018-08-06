import {
    ADD_STAGE_FILES, CLEAR_STAGED_FILES,
    DESELECT_FILE,
    LOAD_FILES,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    AddStageFilesAction, ClearStagedFilesAction,
    DeselectFileAction,
    LoadFilesFromDragAndDropAction,
    SelectFileAction,
    SelectMetadataAction,
} from "./types";
import { UploadFile } from "./types";

export function clearStagedFiles(): ClearStagedFilesAction {
    return {
        type: CLEAR_STAGED_FILES,
    };
}

export function loadFilesFromDragAndDrop(files: FileList): LoadFilesFromDragAndDropAction {
    return {
        payload: files,
        type: LOAD_FILES,
    };
}

export function stageFiles(files: UploadFile[]): AddStageFilesAction {
    return {
        payload: files,
        type: ADD_STAGE_FILES,
    };
}

export function selectFile(file: string | string[]): SelectFileAction {
    return {
        payload: file,
        type: SELECT_FILE,
    };
}

export function deselectFile(file: UploadFile | UploadFile[]): DeselectFileAction {
    return {
        payload: file,
        type: DESELECT_FILE,
    };
}

export function selectMetadata(key: string, payload: string | number): SelectMetadataAction  {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}
