import { AnyAction } from "redux";

import {
    TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    CLEAR_ALERT, SET_ALERT,
    START_LOADING,
    STOP_LOADING,
} from "./constants";
import { ClearAlertAction, FeedbackStateBranch, SetAlertAction, StartLoadingAction, StopLoadingAction } from "./types";

export const initialState: FeedbackStateBranch = {
    isLoading: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [CLEAR_ALERT]: {
        accepts: (action: AnyAction): action is ClearAlertAction => action.type === CLEAR_ALERT,
        perform: (state: FeedbackStateBranch) => {
            return {
                ...state,
                alert: undefined,
            };
        },
    },
    [SET_ALERT]: {
        accepts: (action: AnyAction): action is SetAlertAction => action.type === SET_ALERT,
        perform: (state: FeedbackStateBranch, action: SetAlertAction) => {
            return {
                ...state,
                alert: action.payload,
            };
        },
    },
    [START_LOADING]: {
        accepts: (action: AnyAction): action is StartLoadingAction => action.type === START_LOADING,
        perform: () => ({ isLoading: true }),
    },
    [STOP_LOADING]: {
        accepts: (action: AnyAction): action is StopLoadingAction => action.type === STOP_LOADING,
        perform: () => ({ isLoading: false }),
    },
};

export default makeReducer<FeedbackStateBranch>(actionToConfigMap, initialState);
