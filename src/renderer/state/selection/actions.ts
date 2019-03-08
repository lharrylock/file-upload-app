import { GridCell } from "../../containers/AssociateWells/grid-cell";

import {
    ADD_STAGE_FILES,
    DESELECT_FILES,
    GET_FILES_IN_FOLDER,
    GO_BACK,
    GO_FORWARD,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_BARCODE,
    SELECT_FILE,
    SELECT_PAGE,
    SET_WELL,
    SET_WELLS,
    UPDATE_PAGE_HISTORY_START_INDEX,
    UPDATE_STAGED_FILES,
} from "./constants";
import {
    AddStageFilesAction,
    DeselectFilesAction,
    DragAndDropFileList,
    GetFilesInFolderAction,
    GoBackAction,
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
    NextPageAction,
    Page,
    SelectBarcodeAction,
    SelectFileAction,
    SelectPageAction,
    SetWellAction,
    SetWellsAction,
    UpdatePageHistoryMapAction,
    UpdateStagedFilesAction,
    UploadFile,
    Well,
} from "./types";

export function selectFile(fileId: string | string[]): SelectFileAction {
    return {
        payload: fileId,
        type: SELECT_FILE,
    };
}

export function deselectFiles(): DeselectFilesAction {
    return {
        type: DESELECT_FILES,
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

export function selectPage(currentPage: Page, nextPage: Page): SelectPageAction {
    return {
        payload: { currentPage, nextPage },
        type: SELECT_PAGE,
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

export function goBack(): GoBackAction {
    return {
        type: GO_BACK,
    };
}

export function goForward(): NextPageAction {
    return {
        type: GO_FORWARD,
    };
}
