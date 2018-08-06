import {
    castArray,
    without,
} from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    ADD_STAGE_FILES,
    DESELECT_FILE,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectFileAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
} from "./types";

export const initialState = { // todo this should be empty
    files: [
        {
            files: null,
            name: "image1.ome.tiff",
            path: "/",
        },
        {
            files: null,
            name: "image2.ome.tiff",
            path: "/",
        },
        {
            files: null,
            name: "cells.csv",
            path: "/",
        },
    ],
    stagedFiles: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_FILE]: {
        accepts: (action: AnyAction): action is DeselectFileAction => action.type === DESELECT_FILE,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            files: without(state.files, ...castArray(action.payload)),
        }),
    },
    [SELECT_FILE]: {
        accepts: (action: AnyAction): action is SelectFileAction => action.type === SELECT_FILE,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => {
            // tslint:disable-next-line
            console.log(action.payload);
            return {
                ...state,
                files: [...state.files, ...castArray(action.payload)],
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
