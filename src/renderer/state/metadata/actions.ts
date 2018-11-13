import { GET_FILES_IN_FOLDER } from "../selection/constants";
import { UploadFile } from "../types";

import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
} from "./constants";
import {
    GetFilesInFolderAction,
    MetadataStateBranch,
    ReceiveAction,
    RequestAction,
} from "./types";

export function receiveMetadata(payload: MetadataStateBranch = {}): ReceiveAction {
    return {
        payload,
        type: RECEIVE_METADATA,
    };
}

export function requestMetadata(): RequestAction {
    return {
        type: REQUEST_METADATA,
    };
}

export function getFilesInFolder(folder: UploadFile): GetFilesInFolderAction {
    return {
        payload: folder,
        type: GET_FILES_IN_FOLDER,
    };
}
