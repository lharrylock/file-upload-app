import {
    DESELECT_FILE,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectFileAction,
    SelectFileAction,
    SelectMetadataAction,
} from "./types";
import { File } from "./types";

export function selectFile(file: File | File[]): SelectFileAction {
    return {
        payload: file,
        type: SELECT_FILE,
    };
}

export function deselectFile(file: File | File[]): DeselectFileAction {
    return {
        payload: file,
        type: DESELECT_FILE,
    };
}

export function selectMetadata(key: string, payload: string | number): SelectMetadataAction  {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}
