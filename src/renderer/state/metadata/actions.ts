import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveMetadataAction,
    RequestMetadataAction,
} from "./types";

export function receiveMetadata(payload: MetadataStateBranch = {units: []}): ReceiveMetadataAction {
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
