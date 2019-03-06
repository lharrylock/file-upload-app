import { castArray, clone } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    ADD_STAGE_FILES,
    CLEAR_SELECTION,
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
    Page,
    SelectBarcodeAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
    SelectPageAction,
    SetWellAction,
    SetWellsAction,
    UpdateStagedFilesAction,
} from "./types";

export const initialState: SelectionStateBranch = Object.freeze({
    files: [],
    page: Page.DragAndDrop,
    stagedFiles: [],
    well: undefined,
    wells: [],
});

const actionToConfigMap: TypeToDescriptionMap = {
    [CLEAR_SELECTION]: {
        accepts: (action: AnyAction): action is ClearSelectionAction => action.type === CLEAR_SELECTION,
        perform: (state: SelectionStateBranch, action: ClearSelectionAction) => ({
            ...state,
            [action.payload]: clone(initialState[action.payload]),
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
    [SET_WELL]: {
        accepts: (action: AnyAction): action is SetWellAction => action.type === SET_WELL,
        perform: (state: SelectionStateBranch, action: SetWellAction) => ({
            ...state,
            well: action.payload,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(actionToConfigMap, initialState);
