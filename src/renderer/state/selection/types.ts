import { MetadataStateBranch } from "../metadata/types";

export interface UploadFile {
    name: string;
    path: string;
    files: UploadFile[];
    fullPath: string;
    isDirectory: boolean;
    loadFiles(): Promise<Array<Promise<UploadFile>>>;
}

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    barcode?: string;
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

export interface UpdateStagedFilesAction {
    payload: UploadFile[];
    type: string;
}

export interface GetFilesInFolderAction {
    payload: UploadFile;
    type: string;
}

export interface SelectBarcodeAction {
    payload: {
        barcode: string;
        plateId: number;
    };
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

export interface AppPageConfig {
    container: JSX.Element;
    folderTreeVisible: boolean;
    folderTreeSelectable: boolean;
}
