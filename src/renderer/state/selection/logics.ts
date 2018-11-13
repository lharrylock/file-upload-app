import { stat, Stats } from "fs";
import { isEmpty, uniq } from "lodash";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { startLoading, stopLoading } from "../isLoading/actions";

import {
    ReduxLogicDependencies,
    ReduxLogicDoneCb,
    ReduxLogicNextCb, ReduxLogicTransformDependencies, UploadFile,
} from "../types";
import { batchActions } from "../util";

import { selectPage, stageFiles, updateStagedFiles } from "./actions";
import { GET_FILES_IN_FOLDER, LOAD_FILES, OPEN_FILES } from "./constants";
import { getAppPage, getStagedFiles } from "./selectors";
import { AppPage, DragAndDropFileList } from "./types";

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

const openFilesTransformLogic = ({ action, getState }: ReduxLogicDependencies, next: ReduxLogicNextCb) => {
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

const openFilesLogic = createLogic({
    process: ({ action }: ReduxLogicDependencies, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const originalAction = action.payload.filter((a: AnyAction) => a.type === OPEN_FILES);

        if (!isEmpty(originalAction)) {
            const filesToLoad: string[] = originalAction[0].payload;

            const uploadFilePromises: Array<Promise<UploadFile>> = filesToLoad.map(
                (filePath: string) => getUploadFilePromise(basename(filePath), dirname(filePath))
            );

            stageFilesAndStopLoading(uploadFilePromises, dispatch, done);
        }
    },
    transform: openFilesTransformLogic,
    type: OPEN_FILES,
});

const getNewStagedFiles = (files: UploadFile[], fileToUpdate: UploadFile): UploadFile[] => {
    return files.map((file: UploadFile) => {
        if (file.fullPath === fileToUpdate.fullPath) {
            return fileToUpdate;
        } else if (fileToUpdate.fullPath.indexOf(file.fullPath) === 0) {
            file.files = getNewStagedFiles(file.files, fileToUpdate);
            return file;
        }

        return file;
    });
};

const getFilesInFolderLogic = createLogic({
    transform: ({ action, getState }: ReduxLogicTransformDependencies,
                next: ReduxLogicNextCb) => {
        const folder: UploadFile = action.payload;
        folder.loadFiles()
            .then((filePromises: Array<Promise<UploadFile>>) => {
                Promise.all(filePromises)
                    .then((files: UploadFile[]) => {
                        folder.files = files;
                        const stagedFiles = [...getStagedFiles(getState())];
                        next(updateStagedFiles(getNewStagedFiles(stagedFiles, folder)));
                    });
                    // .catch((reason: any) => console.log(reason));
            });
    },
    type: GET_FILES_IN_FOLDER,
});

export default [
    loadFilesLogic,
    openFilesLogic,
    getFilesInFolderLogic,
];
