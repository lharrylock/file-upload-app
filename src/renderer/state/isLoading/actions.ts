import { START_LOADING, STOP_LOADING } from "./constants";

import {
    StartLoadingAction,
    StopLoadingAction,
} from "./types";

export function startLoading(): StartLoadingAction {
    return {
        type: START_LOADING,
    };
}
export function stopLoading(): StopLoadingAction {
    return {
        type: STOP_LOADING,
    };
}
