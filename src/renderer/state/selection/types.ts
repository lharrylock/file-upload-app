import { MetadataStateBranch } from "../metadata/types";
import { UploadFile } from "../types";

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    page: AppPage;
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

export interface LoadFilesFromDragAndDropAction {
    payload: DragAndDropFileList;
    type: string;
}

export interface LoadFilesFromOpenDialogAction {
    payload: string[];
    type: string;
}

export interface AddStageFilesAction {
    payload: UploadFile[];
    type: string;
}

export interface SelectPageAction {
    payload: AppPage;
    type: string;
}

export interface ClearStagedFilesAction {
    type: string;
}

export interface UpdateStagedFilesAction {
    payload: UploadFile[];
    type: string;
}

export interface DragAndDropFileList {
    readonly length: number;
    [index: number]: DragAndDropFile;
}

export interface DragAndDropFile {
    readonly name: string;
    readonly path: string;
}

export enum AppPage {
    DragAndDrop = 1,
    EnterBarcode,
    PlateMetadataEntry,
    UploadJobs,
    UploadComplete,
}
