import {
    ADD_STAGE_FILES,
    CLEAR_STAGED_FILES,
    DESELECT_FILE,
    GET_FILES_IN_FOLDER,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_FILE,
    SELECT_METADATA,
    SELECT_PAGE,
    UPDATE_STAGED_FILES,
} from "./constants";
import {
    AddStageFilesAction,
    AppPage,
    ClearStagedFilesAction,
    DeselectFileAction,
    DragAndDropFileList,
    GetFilesInFolderAction,
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
    SelectFileAction,
    SelectMetadataAction,
    SelectPageAction,
    UpdateStagedFilesAction,
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

export function loadFilesFromDragAndDrop(files: DragAndDropFileList): LoadFilesFromDragAndDropAction {
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

export function clearStagedFiles(): ClearStagedFilesAction {
    return {
        type: CLEAR_STAGED_FILES,
    };
}

export function updateStagedFiles(files: UploadFile[]): UpdateStagedFilesAction {
    return {
        payload: files,
        type: UPDATE_STAGED_FILES,
    };
}

export function getFilesInFolder(folder: UploadFile): GetFilesInFolderAction {
    return {
        payload: folder,
        type: GET_FILES_IN_FOLDER,
    };
}
