import {
    readdirSync,
    statSync,
} from "fs";
import {
    basename,
    dirname,
    resolve,
} from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { stageFiles } from "./actions";
import {
    LOAD_FILES, OPEN_FILES,
} from "./constants";
import { UploadFile } from "./types";

const getFilesInDirectory = (filePath: string): UploadFile[] => {
    return readdirSync(filePath).map((name: string) => {
        const children = statSync(resolve(filePath, name)).isDirectory() ?
            getFilesInDirectory(resolve(filePath, name)) : null;
        return new UploadFile(name, filePath, children);
    });
};

const loadFilesLogic = createLogic({
    transform: ({ action }: ReduxLogicDeps, next: (action: AnyAction) => void) => {
        const files: UploadFile[] = [];

        for (let i = 0; i < action.payload.length; i++) {
            const file = action.payload.item(i);

            if (file) {
                const children = statSync(file.path).isDirectory() ?
                getFilesInDirectory(file.path) : null;
                files.push(new UploadFile(file.name, dirname(file.path), children));

            } else {
                // todo display error?
            }
        }
        next(stageFiles(files));
    },
    type: LOAD_FILES,
});

const openFilesLogic = createLogic({
    transform: ({ action }: ReduxLogicDeps, next: (action: AnyAction) => void) => {
        const files: UploadFile[] = [];
        for (const file of action.payload) {
            const children = statSync(file).isDirectory() ?
                getFilesInDirectory(file) : null;
            const name = basename(file);
            const path = dirname(file);
            files.push(new UploadFile(name, path, children));
        }
// tslint:disable-next-line
        console.log(files)
        next(stageFiles(files));
    },
    type: OPEN_FILES,
});

export default [
    loadFilesLogic,
    openFilesLogic,
];
