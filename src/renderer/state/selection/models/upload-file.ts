import { readdir, stat, Stats } from "fs";
import { basename, dirname, resolve as resolvePath } from "path";

import { UploadFile } from "../types";

export class UploadFileImpl implements UploadFile {
    public name: string;
    public path: string;
    // this will get populated once the folder is expanded
    public files: UploadFile[] = [];
    public readonly isDirectory: boolean;

    constructor(name: string, path: string, isDirectory: boolean) {
        this.name = name;
        this.path = path;
        this.isDirectory = isDirectory;
    }

    get fullPath(): string {
        return resolvePath(this.path, this.name);
    }

    public loadFiles(): Promise<Array<Promise<UploadFile>>> {
        if (this.isDirectory) {
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
                                    new UploadFileImpl(basename(filePath), dirname(filePath), stats.isDirectory())
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
