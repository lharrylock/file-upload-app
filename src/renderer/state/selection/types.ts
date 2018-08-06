import { resolve } from "path";

import { MetadataStateBranch } from "../metadata/types";

export class UploadFile implements AICSFile {
    public name: string;
    public path: string;
    public files: UploadFile[] | null;

    constructor(name: string, path: string, files: UploadFile[] | null) {
        this.name = name;
        this.path = path;
        this.files = files;
    }

    get isDirectory(): boolean {
        return !!this.files;
    }

    get fullPath(): string {
        return resolve(this.path, this.name);
    }
}

export interface AICSFile {
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

export interface ClearStagedFilesAction {
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    files: string[];
    stagedFiles: UploadFile[];
}

export interface SelectFileAction {
    payload: string | string[];
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
