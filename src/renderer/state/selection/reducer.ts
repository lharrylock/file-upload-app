import {
    castArray,
} from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    ADD_STAGE_FILES,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
} from "./types";

export const initialState = {
    files: [],
    stagedFiles: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [SELECT_FILE]: {
        accepts: (action: AnyAction): action is SelectFileAction => action.type === SELECT_FILE,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => {
            // tslint:disable-next-line
            console.log('files selected:', action.payload);
            return {
                ...state,
                files: [...castArray(action.payload)],
            };
        },
    },
    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction => action.type === SELECT_METADATA,
        perform: (state: SelectionStateBranch, action: SelectMetadataAction) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
    [ADD_STAGE_FILES]: {
        accepts: (action: AnyAction): action is SelectFileAction => action.type === ADD_STAGE_FILES,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => {
            // tslint:disable-next-line
            console.log(action.payload);
            return {
                ...state,
                stagedFiles: [...state.stagedFiles, ...castArray(action.payload)],
            };
        },
    },
};

export default makeReducer<SelectionStateBranch>(actionToConfigMap, initialState);
