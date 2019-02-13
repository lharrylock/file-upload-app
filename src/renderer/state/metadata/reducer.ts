import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { RECEIVE_METADATA } from "./constants";
import {
    MetadataStateBranch,
    ReceiveMetadataAction,
} from "./types";

export const initialState = {
    units: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RECEIVE_METADATA]: {
        accepts: (action: AnyAction): action is ReceiveMetadataAction => action.type === RECEIVE_METADATA,
        perform: (state: MetadataStateBranch, action: ReceiveMetadataAction) => ({ ...state, ...action.payload }),
    },
};

export default makeReducer<MetadataStateBranch>(actionToConfigMap, initialState);
