import { AnyAction } from "redux";

import {
    TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    START_LOADING,
    STOP_LOADING,
} from "./constants";
import { StartLoadingAction, StopLoadingAction } from "./types";

export const initialState: boolean = false;

const actionToConfigMap: TypeToDescriptionMap = {
    [START_LOADING]: {
        accepts: (action: AnyAction): action is StartLoadingAction => action.type === START_LOADING,
        perform: () => true,
    },
    [STOP_LOADING]: {
        accepts: (action: AnyAction): action is StopLoadingAction => action.type === STOP_LOADING,
        perform: () => false,
    },
};

export default makeReducer<boolean>(actionToConfigMap, initialState);
