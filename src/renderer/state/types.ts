import { AxiosPromise, AxiosRequestConfig } from "axios";
import { readdir, stat, Stats } from "fs";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { CreateLogic } from "redux-logic/definitions/logic";

import { MetadataStateBranch } from "./metadata/types";
import { SelectionStateBranch } from "./selection/types";
import Process = CreateLogic.Config.Process;
import DepObj = CreateLogic.Config.DepObj;

export interface ActionDescription {
    accepts: (action: AnyAction) => boolean;
    perform: (state: any, action: any) => any;
}

export interface BatchedAction {
    type: string;
    batch: boolean;
    payload: AnyAction[];
}

export interface ReduxLogicExtraDependencies {
    baseMmsUrl: string;
    httpClient: {
        get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
    };
    ctx?: any;
}

export type ReduxLogicDependencies = Process.DepObj<State, AnyAction, ReduxLogicExtraDependencies>;
export type ReduxLogicTransformDependencies = DepObj<State, AnyAction, ReduxLogicExtraDependencies>;

export type ReduxLogicNextCb = (action: AnyAction) => void;
export type ReduxLogicDoneCb = () => void;

export interface State {
    isLoading: boolean;
    metadata: MetadataStateBranch;
    selection: SelectionStateBranch;
}

export interface TypeToDescriptionMap {
    [propName: string ]: ActionDescription;
}

export class UploadFile {
    public name: string;
    public path: string;
    // this will get populated once the folder is expanded
    public files: UploadFile[] = [];

    private readonly isDirectory: boolean;

    constructor(name: string, path: string, isDirectory: boolean) {
        this.name = name;
        this.path = path;
        this.isDirectory = isDirectory;
    }

    get fullPath(): string {
        return resolvePath(this.path, this.name);
    }

    public getIsDirectory(): boolean {
        return this.isDirectory;
    }

    public loadFiles(): Promise<Array<Promise<UploadFile>>> {
        if (this.getIsDirectory()) {
            return new Promise((resolve, reject) => {
                readdir(this.fullPath, (err: NodeJS.ErrnoException, files: string[]) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(files.map((file: string) => {
                        const filePath = resolvePath(this.fullPath, file);
                        return new Promise((resolve2, reject2) => {
                            stat(filePath, (err2: NodeJS.ErrnoException, stats: Stats) => {
                                if (err2 || !stats) {
                                    return reject2(err2);
                                }

                                return resolve2(
                                    new UploadFile(basename(filePath), dirname(filePath), stats.isDirectory())
                                );
                            });
                        });
                    }));
                });
            });
        }

        return Promise.reject("Not a directory");
    }
}
