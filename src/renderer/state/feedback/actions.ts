import { CLEAR_ALERT, SET_ALERT, START_LOADING, STOP_LOADING } from "./constants";

import {
    AppAlert,
    ClearAlertAction, SetAlertAction,
    StartLoadingAction,
    StopLoadingAction,
} from "./types";

export function setAlert(payload: AppAlert): SetAlertAction {
    return {
        payload,
        type: SET_ALERT,
    };
}

export function clearAlert(): ClearAlertAction {
    return {
        type: CLEAR_ALERT,
    };
}

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
