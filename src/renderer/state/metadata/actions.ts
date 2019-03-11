import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
    UPDATE_PAGE_HISTORY_START_INDEX,
} from "./constants";
import { initialState } from "./reducer";
import {
    MetadataStateBranch,
    ReceiveMetadataAction,
    RequestMetadataAction,
    UpdatePageHistoryMapAction,
} from "./types";

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
