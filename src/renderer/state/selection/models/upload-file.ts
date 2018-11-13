import { resolve as resolvePath } from "path";

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
}
