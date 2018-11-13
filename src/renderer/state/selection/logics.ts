import { stat, Stats } from "fs";
import { isEmpty, uniq } from "lodash";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { startLoading, stopLoading } from "../isLoading/actions";

import {
    ReduxLogicDependencies,
    ReduxLogicDoneCb,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { selectPage, stageFiles } from "./actions";
import { LOAD_FILES, OPEN_FILES } from "./constants";
import { getAppPage } from "./selectors";
import { AppPage, DragAndDropFileList, UploadFile } from "./types";

const getUploadFilePromise = (name: string, path: string): Promise<UploadFile> => (
    new Promise((resolve, reject) => {
        stat(resolvePath(path, name), (err: NodeJS.ErrnoException, stats: Stats) => {
            if (err || !stats) {
                return reject(err);
            }

            return resolve(new UploadFile(name, path, stats.isDirectory()));
        });
    })
);

const stageFilesAndStopLoading = (uploadFilePromises: Array<Promise<UploadFile>>, dispatch: ReduxLogicNextCb,
                                  done: ReduxLogicDoneCb) => {
    Promise.all(uploadFilePromises)
        .then((uploadFiles: UploadFile[]) => {
            // TODO display these files in FolderTree
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
};

const openFilesTransformLogic = ({ action, getState }: ReduxLogicDependencies, next: (action: AnyAction) => void) => {
    const actions = [action, startLoading()];
    const page: AppPage = getAppPage(getState());
    if (page === AppPage.DragAndDrop) {
        actions.push(selectPage(AppPage.EnterBarcode));
    }
    next(batchActions(actions));
};

const loadFilesLogic = createLogic({
    process: ({ action }: ReduxLogicDependencies, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const originalAction = action.payload.filter((a: AnyAction) => a.type === LOAD_FILES);

        if (!isEmpty(originalAction)) {
            const filesToLoad: DragAndDropFileList = originalAction[0].payload;
            const uploadFilePromises: Array<Promise<UploadFile>> = [];
            // map and for-of does not exist on type FileList so we have to use a basic for loop
            // tslint:disable-next-line
            for (let i = 0; i < filesToLoad.length; i++) {
                const fileToLoad = filesToLoad[i];
                uploadFilePromises.push(
                    getUploadFilePromise(fileToLoad.name, dirname(fileToLoad.path))
                );
            }

            stageFilesAndStopLoading(uploadFilePromises, dispatch, done);
        }
    },
    transform: openFilesTransformLogic,
    type: LOAD_FILES,
});

const mergeChildPaths = (filePaths: string[]): string[] => {
    filePaths = uniq(filePaths);

    return filePaths.filter((filePath) => {
        const otherFilePaths = filePaths.filter((otherFilePath) => otherFilePath !== filePath);
        return !otherFilePaths.find((otherFilePath) => {
            return filePath.indexOf(otherFilePath) === 0;
        });
    });
};

const openFilesLogic = createLogic({
    process: ({ action }: ReduxLogicDependencies, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const originalAction = action.payload.filter((a: AnyAction) => a.type === OPEN_FILES);

        if (!isEmpty(originalAction)) {
            const filesToLoad: string[] = mergeChildPaths(originalAction[0].payload);
            console.log(filesToLoad)

            const uploadFilePromises: Array<Promise<UploadFile>> = filesToLoad.map(
                (filePath: string) => getUploadFilePromise(basename(filePath), dirname(filePath))
            );

            stageFilesAndStopLoading(uploadFilePromises, dispatch, done);
        }
    },
    transform: openFilesTransformLogic,
    type: OPEN_FILES,
});

export default [
    loadFilesLogic,
    openFilesLogic,
];
