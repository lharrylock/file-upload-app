import { AnyAction } from "redux";

export interface FeedbackStateBranch {
    alert?: AppAlert;
    isLoading: boolean;
    requestsInProgress: Set<HttpRequestType>;
}

export interface StartLoadingAction {
    type: string;
}

export interface StopLoadingAction {
    type: string;
}

export interface AppAlert {
    statusCode?: number;
    message: string;
    onNo?: AnyAction;
    onYes?: AnyAction;
    type: AlertType;
}

export enum AlertType {
    WARN = 1,
    SUCCESS,
    ERROR,
}

export interface SetAlertAction {
    payload: AppAlert;
    type: string;
}

export interface ClearAlertAction {
    type: string;
}

export enum HttpRequestType {
    GET_WELLS = 1,
}

export interface AddRequestInProgressAction {
    type: string;
    payload: HttpRequestType;
}

export interface RemoveRequestInProgressAction {
    type: string;
    payload: HttpRequestType;
}
