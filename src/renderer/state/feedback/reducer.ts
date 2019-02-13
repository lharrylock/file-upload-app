import { AnyAction } from "redux";

import {
    TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    START_LOADING,
    STOP_LOADING,
} from "./constants";
import { FeedbackStateBranch, StartLoadingAction, StopLoadingAction } from "./types";

export const initialState: FeedbackStateBranch = {
    isLoading: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
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
