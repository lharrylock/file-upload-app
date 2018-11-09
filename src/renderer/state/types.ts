import { AxiosInstance } from "axios";
import { AnyAction } from "redux";
import { CreateLogic } from "redux-logic/definitions/logic";

import { MetadataStateBranch } from "./metadata/types";
import { SelectionStateBranch } from "./selection/types";
import Process = CreateLogic.Config.Process;

export interface ActionDescription {
    accepts: (action: AnyAction) => boolean;
    perform: (state: any, action: any) => any;
}

export interface BatchedAction {
    type: string;
    batch: boolean;
    payload: AnyAction[];
}

export interface ReduxLogicDeps {
    action: AnyAction;
    baseApiUrl: string;
    httpClient: AxiosInstance;
    getState: () => State;
    ctx?: any;
}

export type ReduxProcessDeps = Process.DepObj<State, AnyAction, ReduxLogicDeps, undefined>;

export type ReduxLogicNextCb = (action: AnyAction) => void;
export type ReduxLogicDoneCb = () => void;

export interface State {
    isLoading: boolean;
    metadata: MetadataStateBranch;
    selection: SelectionStateBranch;
}

export interface TypeToDescriptionMap {
    [propName: string ]: ActionDescription;
}
