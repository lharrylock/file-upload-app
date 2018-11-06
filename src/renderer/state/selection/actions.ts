import {
    ADD_STAGE_FILES,
    DESELECT_FILE,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_FILE,
    SELECT_METADATA,
    SELECT_PAGE,
} from "./constants";
import {
    AddStageFilesAction,
    AppPage,
    DeselectFileAction,
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
    SelectFileAction,
    SelectMetadataAction,
    SelectPageAction,
    UploadFile,
} from "./types";

export function selectFile(fileId: string | string[]): SelectFileAction {
    return {
        payload: fileId,
        type: SELECT_FILE,
    };
}

export function deselectFile(fileId: string | string[]): DeselectFileAction {
    return {
        payload: fileId,
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

export function loadFilesFromDragAndDrop(files: FileList): LoadFilesFromDragAndDropAction {
    return {
        payload: files,
        type: LOAD_FILES,
    };
}

export function openFilesFromDialog(files: string[]): LoadFilesFromOpenDialogAction {
    return {
        payload: files,
        type: OPEN_FILES,
    };
}

export function stageFiles(files: UploadFile[]): AddStageFilesAction {
    return {
        payload: files,
        type: ADD_STAGE_FILES,
    };
}

export function selectPage(page: AppPage): SelectPageAction {
    return {
        payload: page,
        type: SELECT_PAGE,
    };
}
