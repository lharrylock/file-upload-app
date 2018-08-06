import { MetadataStateBranch } from "../metadata/types";

export interface UploadFile {
    name: string;
    path: string;
    files: UploadFile[] | null;
}

export interface DeselectFileAction {
    payload: UploadFile | UploadFile[];
    type: string;
}

export interface LoadFilesFromDragAndDropAction {
    payload: FileList;
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    files: UploadFile[];
    stagedFiles: UploadFile[];
}

export interface SelectFileAction {
    payload: UploadFile | UploadFile[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}

export interface AddStageFilesAction {
    payload: UploadFile[];
    type: string;
}
