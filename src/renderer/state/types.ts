import { AicsGridCell } from "aics-react-labkey";
import { AxiosPromise, AxiosRequestConfig } from "axios";
import { AnyAction } from "redux";
import { CreateLogic } from "redux-logic/definitions/logic";

import { FeedbackStateBranch } from "./feedback/types";
import { MetadataStateBranch } from "./metadata/types";
import { SelectionStateBranch } from "./selection/types";
import { UploadStateBranch } from "./upload/types";
import Process = CreateLogic.Config.Process;
import DepObj = CreateLogic.Config.DepObj;

export interface ActionDescription {
    accepts: (action: AnyAction) => boolean;
    perform: (state: any, action: any) => any;
}

export interface BatchedAction {
    type: string;
    batch: boolean;
    payload: AnyAction[];
}

export interface ReduxLogicExtraDependencies {
    baseMmsUrl: string;
    httpClient: {
        get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
    };
    ctx?: any;
}

export type ReduxLogicDependencies = Process.DepObj<State, AnyAction, ReduxLogicExtraDependencies>;
export type ReduxLogicTransformDependencies = DepObj<State, AnyAction, ReduxLogicExtraDependencies>;

export type ReduxLogicNextCb = (action: AnyAction) => void;
export type ReduxLogicDoneCb = () => void;

export interface State {
    feedback: FeedbackStateBranch;
    metadata: MetadataStateBranch;
    selection: SelectionStateBranch;
    upload: UploadStateBranch;
}

export interface TypeToDescriptionMap {
    [propName: string ]: ActionDescription;
}

export interface AicsResponse {
    responseType: "SUCCESS" | "SERVER_ERROR" | "CLIENT_ERROR";
}

export interface AicsSuccessResponse<T> extends AicsResponse {
    data: T[];
    totalCount: number;
    hasMore?: boolean;
    offset: number;
}

export enum HTTP_STATUS {
    BAD_GATEWAY = 502,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    OK = 200,
}
