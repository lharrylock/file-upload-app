import { UploadFile } from "../types";

export interface MetadataStateBranch {
    [key: string]: any;
}

export interface GetFilesInFolderAction {
    payload: UploadFile;
    type: string;
}

export interface ReceiveAction {
    payload: MetadataStateBranch;
    type: string;
}

export interface RequestAction {
    type: string;
}
