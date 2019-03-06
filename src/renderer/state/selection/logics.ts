import { AxiosResponse } from "axios";
import { stat, Stats } from "fs";
import { isEmpty, uniq } from "lodash";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { API_WAIT_TIME_SECONDS } from "../constants";

import {
    addRequestToInProgress,
    clearAlert,
    removeRequestFromInProgress,
    setAlert,
    startLoading,
    stopLoading
} from "../feedback/actions";
import { AlertType, HttpRequestType } from "../feedback/types";

import {
    AicsSuccessResponse,
    HTTP_STATUS,
    ReduxLogicDependencies,
    ReduxLogicDoneCb,
    ReduxLogicNextCb,
    ReduxLogicTransformDependencies
} from "../types";
import { clearUpload } from "../upload/actions";
import { batchActions, getActionFromBatch } from "../util";

import {
    clearSelection,
    selectPage,
    setWells,
    stageFiles,
    updateStagedFiles,
} from "./actions";
import {
    GET_FILES_IN_FOLDER,
    GO_BACK,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_BARCODE,
} from "./constants";
import { UploadFileImpl } from "./models/upload-file";
import {
    getPage,
    getStagedFiles,
} from "./selectors";
import { DragAndDropFileList, Page, UploadFile, Well } from "./types";

const mergeChildPaths = (filePaths: string[]): string[] => {
    filePaths = uniq(filePaths);

    return filePaths.filter((filePath) => {
        const otherFilePaths = filePaths.filter((otherFilePath) => otherFilePath !== filePath);
        return !otherFilePaths.find((otherFilePath) => filePath.indexOf(otherFilePath) === 0);
    });
};

const getUploadFilePromise = (name: string, path: string): Promise<UploadFile> => (
    new Promise((resolve, reject) => {
        stat(resolvePath(path, name), (err: NodeJS.ErrnoException, stats: Stats) => {
            if (err || !stats) {
                return reject(err);
            }

            return resolve(new UploadFileImpl(name, path, stats.isDirectory()));
        });
    })
);

const stageFilesAndStopLoading = (uploadFilePromises: Array<Promise<UploadFile>>, dispatch: ReduxLogicNextCb,
                                  done: ReduxLogicDoneCb) => {
    Promise.all(uploadFilePromises)
        .then((uploadFiles: UploadFile[]) => {
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
    const page: Page = getPage(getState());
    if (page === Page.DragAndDrop) {
        actions.push(selectPage(Page.EnterBarcode));
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
            const filesToLoad: string[] = mergeChildPaths(originalAction[0].payload);

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
                    })
                    // tslint:disable-next-line
                    .catch((reason: string) => console.log(reason));
            });
    },
    type: GET_FILES_IN_FOLDER,
});

async function getWells({ action, getState, httpClient, baseMmsUrl }: ReduxLogicTransformDependencies,
                        plateId: number): Promise<AxiosResponse<AicsSuccessResponse<Well[]>>> {
    return httpClient.get(`${baseMmsUrl}/1.0/plate/${plateId}/well/`);
}

export const GENERIC_GET_WELLS_ERROR_MESSAGE = (barcode: string) => `Could not retrieve wells for barcode ${barcode}`;
export const MMS_IS_DOWN_MESSAGE = "Could not contact server. Make sure MMS is running.";
export const MMS_MIGHT_BE_DOWN_MESSAGE = "Server might be down. Retrying GET wells request...";

const selectBarcodeLogic = createLogic({
    process: async (deps: ReduxLogicDependencies, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const action = getActionFromBatch(deps.action, SELECT_BARCODE);

        if (!action) {
            done();
        } else {
            const { plateId } = action.payload;
            const startTime = (new Date()).getTime() / 1000;
            let currentTime = startTime;
            let receivedSuccessfulResponse = false;
            let receivedNonGatewayError = false;
            let sentRetryAlert = false;

            while ((currentTime - startTime < API_WAIT_TIME_SECONDS) && !receivedSuccessfulResponse
            && !receivedNonGatewayError) {
                try {
                    const response = await getWells(deps, plateId);
                    const wells: Well[][] = response.data.data;
                    receivedSuccessfulResponse = true;
                    dispatch(batchActions([
                        selectPage(Page.AssociateWells),
                        setWells(wells),
                        removeRequestFromInProgress(HttpRequestType.GET_WELLS),
                        action,
                    ]));
                } catch (e) {
                    if (e.response && e.response.status === HTTP_STATUS.BAD_GATEWAY) {
                        if (!sentRetryAlert) {
                            dispatch(
                                setAlert({
                                    manualClear: true,
                                    message: MMS_MIGHT_BE_DOWN_MESSAGE,
                                    type: AlertType.WARN,
                                })
                            );
                            sentRetryAlert = true;
                        }
                    } else {
                        receivedNonGatewayError = true;
                    }
                } finally {
                    currentTime = (new Date()).getTime() / 1000;
                }
            }

            if (receivedSuccessfulResponse) {
                if (sentRetryAlert) {
                    dispatch(clearAlert());
                }

                done();
            } else {
                const message = sentRetryAlert ? MMS_IS_DOWN_MESSAGE :
                    GENERIC_GET_WELLS_ERROR_MESSAGE(action.payload.barcode);
                dispatch(batchActions([
                    action,
                    removeRequestFromInProgress(HttpRequestType.GET_WELLS),
                    setAlert({
                        message,
                        type: AlertType.ERROR,
                    }),
                ]));

                done();
            }
        }

    },
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            addRequestToInProgress(HttpRequestType.GET_WELLS),
            action,
        ]));
    },
    type: SELECT_BARCODE,
});

const prevPageConfig = {
    [Page.DragAndDrop]: undefined,
    [Page.EnterBarcode]: Page.DragAndDrop,
    [Page.AssociateWells]: Page.EnterBarcode,
    [Page.UploadJobs]: Page.UploadJobs,
    [Page.UploadComplete]: Page.UploadJobs,
};
const goBackLogic = createLogic({
    transform: ({getState}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        const currentPage = getPage(getState());
        const nextPage = prevPageConfig[currentPage];

        if (nextPage) {
            const actions: AnyAction[] = [
                selectPage(nextPage),
            ];

            switch (currentPage) {
                case Page.AssociateWells:
                    actions.push(
                        clearUpload(),
                        clearSelection("well")
                    );
                    break;
                case Page.EnterBarcode:
                    actions.push(
                        clearSelection("barcode"),
                        clearSelection("plateId"),
                        clearSelection("wells"),
                        clearSelection("stagedFiles")
                    );
                    break;
            }
            next(batchActions(actions));
        }
    },
    type: GO_BACK,
});

export default [
    goBackLogic,
    loadFilesLogic,
    openFilesLogic,
    getFilesInFolderLogic,
    selectBarcodeLogic,
];
