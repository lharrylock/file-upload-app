import { readdir, readdirSync, stat, Stats, statSync } from "fs";
import { isEmpty } from "lodash";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { startLoading, stopLoading } from "../isLoading/actions";

import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";
import { batchActions } from "../util";

import { selectPage, stageFiles } from "./actions";
import { LOAD_FILES, OPEN_FILES } from "./constants";
import { getAppPage } from "./selectors";
import { AppPage, UploadFile } from "./types";

const loadFilesLogic = createLogic({
    transform: ({ action }: ReduxLogicDeps, next: (action: AnyAction) => void) => {
        const files: UploadFile[] = [];

        // for (let i = 0; i < action.payload.length; i++) {
        //     const file = action.payload.item(i);
        //
        //     if (file) {
        //         const children = statSync(file.path).isDirectory() ?
        //             getFilesInDirectory(file.path) : null;
        //         files.push(new UploadFile(file.name, dirname(file.path), children));
        //
        //     } else {
        //         // todo display error?
        //     }
        // }
        next(stageFiles(files));
    },
    type: LOAD_FILES,
});

const openFilesLogic = createLogic({
    process: ({ action, getState }: ReduxLogicDeps, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const originalAction = action.payload.filter((a: AnyAction) => a.type === OPEN_FILES);

        if (!isEmpty(originalAction)) {
            const filesToLoad: string[] = originalAction[0].payload;

            // map filesToLoad to a list of promises
            // Promise.all these promises
            const uploadFilePromises: Array<Promise<UploadFile>> = filesToLoad.map((file: string) => (
                new Promise((resolve, reject) => {
                    stat(file, (err: NodeJS.ErrnoException, stats: Stats) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(new UploadFile(basename(file), dirname(file), stats.isDirectory()));
                    });
                })
            ));

            Promise.all(uploadFilePromises)
                .then((uploadFiles: UploadFile[]) => {
                    // tslint:disable-next-line
                    console.log("staged files", uploadFiles);
                    dispatch(batchActions([
                        stageFiles(uploadFiles),
                        stopLoading(),
                    ]));
                    done();
                })
                .catch(() => {
                    dispatch(stopLoading());
                    done();
                });
        }
    },
    transform: ({ action, getState }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const actions = [action, startLoading()];
        const page: AppPage = getAppPage(getState());
        if (page === AppPage.DragAndDrop) {
            actions.push(selectPage(AppPage.EnterBarcode));
        }
        next(batchActions(actions));
    },
    type: OPEN_FILES,
});

export default [
    loadFilesLogic,
    openFilesLogic,
];
