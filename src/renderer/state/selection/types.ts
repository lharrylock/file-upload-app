import { readdir, stat, Stats } from "fs";
import { resolve as resolvePath } from "path";

import { MetadataStateBranch } from "../metadata/types";

export class UploadFile implements AICSFile {
    public name: string;
    public path: string;
    public files: UploadFile[] | undefined;

    private readonly isDirectory: boolean;

    constructor(name: string, path: string, isDirectory: boolean) {
        this.name = name;
        this.path = path;
        this.files = isDirectory ? [] : undefined;
        this.isDirectory = isDirectory;
    }

    // run this if files is empty and this is a directory
    public getChildren(): Promise<Array<Promise<UploadFile>>> {
        if (this.isDirectory) {
            return new Promise((resolve, reject) => {
                readdir(this.fullPath, (err: NodeJS.ErrnoException, files: string[]) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(files.map((file: string) => {
                        return new Promise((resolve2, reject2) => {
                            stat(file, (err2: NodeJS.ErrnoException, stats: Stats) => {
                                if (err2) {
                                    reject2(err2);
                                }

                                resolve2(new UploadFile(file, "", stats.isDirectory()));
                            });
                        });
                    }));
                });
            });
        }

        throw new Error("Not a directory");
    }

    get fullPath(): string {
        return resolvePath(this.path, this.name);
    }

    public getIsDirectory(): boolean {
        return this.isDirectory;
    }
}

export interface AICSFile {
    name: string;
    path: string;
    files?: UploadFile[];
}

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    files: string[];
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
    payload: FileList;
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

export enum AppPage {
    DragAndDrop = 1,
    EnterBarcode,
    PlateMetadataEntry,
    UploadJobs,
    UploadComplete,
}
