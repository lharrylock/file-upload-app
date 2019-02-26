import {
    castArray,
    uniq,
    without,
} from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    ADD_STAGE_FILES,
    DESELECT_FILE,
    DESELECT_WELLS_FOR_UPLOAD,
    SELECT_BARCODE,
    SELECT_FILE,
    SELECT_METADATA,
    SELECT_PAGE,
    SET_WELLS,
    SET_WELLS_FOR_UPLOAD,
    UPDATE_STAGED_FILES,
} from "./constants";
import {
    AddStageFilesAction,
    AppPage,
    DeselectFileAction,
    DeselectWellsForUploadAction,
    SelectBarcodeAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
    SelectPageAction,
    SetWellsAction,
    SetWellsForUploadAction,
    UpdateStagedFilesAction,
} from "./types";

export const initialState = {
    files: [],
    page: AppPage.DragAndDrop,
    stagedFiles: [],
    wells: [],
    wellsForUpload: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_FILE]: {
        accepts: (action: AnyAction): action is DeselectFileAction => action.type === DESELECT_FILE,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            files: without(state.files, ...castArray(action.payload)),
        }),
    },
    [SELECT_BARCODE]: {
        accepts: (action: AnyAction): action is SelectBarcodeAction => action.type === SELECT_BARCODE,
        perform: (state: SelectionStateBranch, action: SelectBarcodeAction) => ({
            ...state,
            ...action.payload,
        }),
    },
    [SELECT_FILE]: {
        accepts: (action: AnyAction): action is SelectFileAction => action.type === SELECT_FILE,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => ({
            ...state,
            files: [...castArray(action.payload)],
        }),
    },
    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction => action.type === SELECT_METADATA,
        perform: (state: SelectionStateBranch, action: SelectMetadataAction) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
    [SELECT_PAGE]: {
        accepts: (action: AnyAction): action is SelectPageAction => action.type === SELECT_PAGE,
        perform: (state: SelectionStateBranch, action: SelectPageAction) => ({
            ...state,
            page: action.payload,
        }),
    },
    [SET_WELLS]: {
        accepts: (action: AnyAction): action is SetWellsAction => action.type === SET_WELLS,
        perform: (state: SelectionStateBranch, action: SetWellsAction) => ({
            ...state,
            wells: action.payload,
        }),
    },
    [ADD_STAGE_FILES]: {
        accepts: (action: AnyAction): action is AddStageFilesAction => action.type === ADD_STAGE_FILES,
        perform: (state: SelectionStateBranch, action: AddStageFilesAction) => ({
            ...state,
            stagedFiles: [...state.stagedFiles, ...castArray(action.payload)],
        }),
    },
    [UPDATE_STAGED_FILES]: {
        accepts: (action: AnyAction): action is UpdateStagedFilesAction => action.type === UPDATE_STAGED_FILES,
        perform: (state: SelectionStateBranch, action: UpdateStagedFilesAction) => ({
            ...state,
            stagedFiles: action.payload,
        }),
    },
    [SET_WELLS]: {
        accepts: (action: AnyAction): action is SetWellsAction => action.type === SET_WELLS,
        perform: (state: SelectionStateBranch, action: SetWellsAction) => ({
            ...state,
            wells: action.payload,
        }),
    },
    [SET_WELLS_FOR_UPLOAD]: {
        accepts: (action: AnyAction): action is SetWellsForUploadAction => action.type === SET_WELLS_FOR_UPLOAD,
        perform: (state: SelectionStateBranch, action: SetWellsForUploadAction) => ({
            ...state,
            wellsForUpload: uniq(castArray(action.payload)),
        }),
    },
    [DESELECT_WELLS_FOR_UPLOAD]: {
        accepts: (action: AnyAction): action is DeselectWellsForUploadAction =>
            action.type === DESELECT_WELLS_FOR_UPLOAD,
        perform: (state: SelectionStateBranch, action: DeselectWellsForUploadAction) => ({
            ...state,
            wellsForUpload: without(state.wellsForUpload, ...castArray(action.payload)),
        }),
    },
};

export default makeReducer<SelectionStateBranch>(actionToConfigMap, initialState);
