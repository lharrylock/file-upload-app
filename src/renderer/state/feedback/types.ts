import { AnyAction } from "redux";

export interface FeedbackStateBranch {
    alert?: AppAlert;
    isLoading: boolean;
}

export interface StartLoadingAction {
    type: string;
}

export interface StopLoadingAction {
    type: string;
}

export interface AppAlert {
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
