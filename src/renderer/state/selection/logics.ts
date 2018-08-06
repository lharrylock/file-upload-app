import {
    readdirSync,
    statSync,
} from "fs";
import * as path from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { stageFiles } from "./actions";
import { LOAD_FILES } from "./constants";
import { UploadFile } from "./types";

const getFilesInDirectory = (filePath: string): UploadFile[] => {
    return readdirSync(filePath).map((name: string) => {
        const children = statSync(path.resolve(filePath, name)).isDirectory() ?
            getFilesInDirectory(path.resolve(filePath, name)) : null;
        return new UploadFile(name, filePath, children);
    });
};

const loadFilesLogic = createLogic({
    transform: ({ action }: ReduxLogicDeps, next: (action: AnyAction) => void) => {
        const files: UploadFile[] = [];
        // tslint:disable-next-line
        console.log('in logic')
        for (let i = 0; i < action.payload.length; i++) {
            const file = action.payload.item(i);

            if (file) {
                const children = statSync(file.path).isDirectory() ?
                getFilesInDirectory(file.path) : null;
                files.push(new UploadFile(file.name, file.path, children));

            } else {
                // display error?
            }
        }

        next(stageFiles(files));
    },
    type: LOAD_FILES,
});
export default [
    loadFilesLogic,
];
