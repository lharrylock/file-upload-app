import { GridCell } from "../../containers/AssociateWells/grid-cell";

import {
    ADD_STAGE_FILES,
    CLEAR_SELECTION,
    GET_FILES_IN_FOLDER,
    GO_BACK,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_BARCODE,
    SELECT_FILE,
    SELECT_METADATA,
    SELECT_PAGE,
    SET_WELL,
    SET_WELLS,
    UPDATE_STAGED_FILES,
} from "./constants";
import {
    AddStageFilesAction,
    ClearSelectionAction,
    DragAndDropFileList,
    GetFilesInFolderAction, GoBackAction,
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
    Page,
    SelectBarcodeAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
    SelectPageAction,
    SetWellAction,
    SetWellsAction,
    UpdateStagedFilesAction,
    UploadFile,
    Well,
} from "./types";

export function clearSelection(key: keyof SelectionStateBranch): ClearSelectionAction {
    return {
       payload: key,
       type: CLEAR_SELECTION,
    };
}

export function selectFile(fileId: string | string[]): SelectFileAction {
    return {
        payload: fileId,
        type: SELECT_FILE,
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

export function selectPage(page: Page): SelectPageAction {
    return {
        payload: page,
        type: SELECT_PAGE,
    };
}

export function goBack(): GoBackAction {
    return {
        type: GO_BACK,
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

export function selectBarcode(barcode: string, plateId: number): SelectBarcodeAction {
    return {
        payload: {
            barcode,
            plateId,
        },
        type: SELECT_BARCODE,
    };
}

export function setWells(wells: Well[][]): SetWellsAction {
    return {
        payload: wells,
        type: SET_WELLS,
    };
}

export function setWell(well: GridCell): SetWellAction {
    return {
        payload: well,
        type: SET_WELL,
    };
}
