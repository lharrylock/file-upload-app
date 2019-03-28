export interface FeedbackStateBranch {
    alert?: AppAlert;
    events: AppEvent[];
    isLoading: boolean;
    requestsInProgress: AsyncRequestType[];
}

export interface StartLoadingAction {
    type: string;
}

export interface StopLoadingAction {
    type: string;
}

export interface AppAlert {
    manualClear?: boolean;
    message?: string;
    statusCode?: number;
    type: AlertType;
}

export interface AppEvent {
    message: string;
    date: Date;
    type: AlertType;
}

export enum AlertType {
    WARN = 1,
    SUCCESS,
    ERROR,
    INFO,
}

export interface SetAlertAction {
    payload: AppAlert;
    type: string;
}

export interface ClearAlertAction {
    type: string;
}

export enum AsyncRequestType {
    GET_WELLS = "GET_WELLS",
    START_UPLOAD = "START_UPLOAD",
    COPY_FILES = "COPY_FILES",
    UPLOAD_METADATA = "UPLOAD_METADATA",
}

export interface AddRequestInProgressAction {
    type: string;
    payload: AsyncRequestType;
}

export interface RemoveRequestInProgressAction {
    type: string;
    payload: AsyncRequestType;
}

export interface AddEventAction {
    type: string;
    payload: {
        date: Date;
        message: string;
        type: AlertType;
    };
}
