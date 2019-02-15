import {
    ADD_REQUEST_IN_PROGRESS,
    CLEAR_ALERT,
    REMOVE_REQUEST_IN_PROGRESS,
    SET_ALERT,
    START_LOADING,
    STOP_LOADING
} from "./constants";

import {
    AddRequestInProgressAction,
    AppAlert,
    ClearAlertAction, HttpRequestType, RemoveRequestInProgressAction, SetAlertAction,
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

export function addRequestToInProgress(payload: HttpRequestType): AddRequestInProgressAction {
    return {
        payload,
        type: ADD_REQUEST_IN_PROGRESS,
    };
}

export function removeRequestFromInProgress(payload: HttpRequestType): RemoveRequestInProgressAction {
    return {
        payload,
        type: REMOVE_REQUEST_IN_PROGRESS,
    };
}