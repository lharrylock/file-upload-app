import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { RECEIVE_METADATA, UPDATE_PAGE_HISTORY_START_INDEX } from "./constants";
import {
    MetadataStateBranch,
    ReceiveMetadataAction,
    UpdatePageHistoryMapAction,
} from "./types";

export const initialState = {
    history: {
        selection: {},
        upload: {},
    },
    units: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RECEIVE_METADATA]: {
        accepts: (action: AnyAction): action is ReceiveMetadataAction => action.type === RECEIVE_METADATA,
        perform: (state: MetadataStateBranch, action: ReceiveMetadataAction) => ({ ...state, ...action.payload }),
    },
    [UPDATE_PAGE_HISTORY_START_INDEX]: {
        accepts: (action: AnyAction): action is UpdatePageHistoryMapAction =>
            action.type === UPDATE_PAGE_HISTORY_START_INDEX,
        perform: (state: MetadataStateBranch, action: UpdatePageHistoryMapAction) => ({
            ...state,
            history: {
                ...state.history,
                [action.payload.branch]: {
                    ...state.history[action.payload.branch],
                    [action.payload.page]: action.payload.index,
                },
            },
        }),
    },
};

export default makeReducer<MetadataStateBranch>(actionToConfigMap, initialState);
