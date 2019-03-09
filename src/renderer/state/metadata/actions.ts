import { Page } from "../selection/types";
import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
    UPDATE_PAGE_HISTORY_START_INDEX,
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveMetadataAction,
    RequestMetadataAction, UpdatePageHistoryMapAction,
} from "./types";

// todo this is copied from the reducer...
const initialState = {
    history: {
        selection: {},
        upload: {},
    },
    units: [],
};

export function receiveMetadata(payload: MetadataStateBranch = initialState): ReceiveMetadataAction {
    return {
        payload,
        type: RECEIVE_METADATA,
    };
}

export function requestMetadata(): RequestMetadataAction {
    return {
        type: REQUEST_METADATA,
    };
}

export function updatePageHistoryMap(page: string, selectionIndex: number, uploadIndex: number):
    UpdatePageHistoryMapAction {
    return {
        payload: {
            selection: {
                [page]: selectionIndex,
            },
            upload: {
                [page]: uploadIndex,
            },
        },
        type: UPDATE_PAGE_HISTORY_START_INDEX,
    };
}
