import { AxiosResponse } from "axios";
import { stat, Stats } from "fs";
import { isEmpty, uniq } from "lodash";
import { basename, dirname, resolve as resolvePath } from "path";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";
import { ActionCreators } from "redux-undo";

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
import { updatePageHistory } from "../metadata/actions";
import { getSelectionHistory, getUploadHistory } from "../metadata/selectors";

import {
    AicsSuccessResponse,
    HTTP_STATUS,
    ReduxLogicDependencies,
    ReduxLogicDoneCb,
    ReduxLogicNextCb,
    ReduxLogicTransformDependencies,
    State
} from "../types";
import { clearUploadHistory, jumpToPastUpload } from "../upload/actions";
import { getCurrentUploadIndex } from "../upload/selectors";
import { batchActions, getActionFromBatch } from "../util";

import {
    clearSelectionHistory,
    jumpToPastSelection,
    selectPage,
    setWells,
    stageFiles,
    updateStagedFiles
} from "./actions";
import {
    GET_FILES_IN_FOLDER,
    GO_BACK,
    GO_FORWARD,
    LOAD_FILES,
    OPEN_FILES,
    SELECT_BARCODE,
    SELECT_PAGE,
} from "./constants";
import { UploadFileImpl } from "./models/upload-file";
import {
    getCurrentSelectionIndex,
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
        actions.push(...getGoForwardActions(page, getState()));
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
                    const actions = [
                        setWells(wells),
                        removeRequestFromInProgress(HttpRequestType.GET_WELLS),
                        action,
                    ];
                    actions.push(...getGoForwardActions(Page.EnterBarcode, deps.getState()));
                    dispatch(batchActions(actions));
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

const pageOrder: Page[] = [
    Page.DragAndDrop,
    Page.EnterBarcode,
    Page.AssociateWells,
    Page.UploadJobs,
    Page.UploadComplete,
];
const selectPageLogic = createLogic({
    process: ({action, getState}: ReduxLogicDependencies, next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const { currentPage, nextPage } = action.payload;
        const state = getState();

        const nextPageOrder: number = pageOrder.indexOf(nextPage);
        const currentPageOrder: number = pageOrder.indexOf(currentPage);

        // going back - rewind selections and uploads to the state they were at when user was on previous page
        if (nextPageOrder < currentPageOrder) {
            const selectionIndex = getSelectionHistory(state)[nextPage];
            const uploadIndex = getUploadHistory(state)[nextPage];

            if (selectionIndex > -1) {
                next(jumpToPastSelection(selectionIndex));
            }

            if (selectionIndex === 0) {
                next(clearSelectionHistory());
            }

            if (uploadIndex > -1) {
                next(jumpToPastUpload(uploadIndex));
            }

            if (uploadIndex === 0) {
                next(clearUploadHistory());
            }

        // going forward - store current selection/upload indexes so we can rewind to this state if user goes back
        } else if (nextPageOrder > currentPageOrder) {
            const selectionIndex = getCurrentSelectionIndex(state);
            const uploadIndex = getCurrentUploadIndex(state);
            next(updatePageHistory(getPage(state), selectionIndex, uploadIndex));
        }

        done();
    },
    type: SELECT_PAGE,
});

const goBackLogic = createLogic({
    transform: ({getState, action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb, reject: () => void) => {
        const state = getState();
        const currentPage = getPage(state);
        const nextPage = getNextPage(currentPage, -1);

        if (nextPage) {
            next(selectPage(currentPage, nextPage));
        } else {
            reject();
        }
    },
    type: GO_BACK,
});

const goForwardLogic = createLogic({
    transform: ({action, getState}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb, reject: () => void) => {
        const currentPage = getPage(getState());
        const nextPage = getNextPage(currentPage, 1);

        if (nextPage) {
            next(selectPage(currentPage, nextPage));
        } else {
           reject();
        }
    },
    type: GO_FORWARD,
});

/***
 * Helper function for getting a page relative to a given page. Returns null if direction is out of bounds or
 * if current page is not recognized.
 * @param currentPage page to start at
 * @param direction number of steps forward or back (negative) from currentPage
 */
const getNextPage = (currentPage: Page, direction: number): Page | null => {
    const currentPageIndex = pageOrder.indexOf(currentPage);
    if (currentPageIndex > -1) {
        const nextPageIndex = currentPageIndex + direction;

        if (nextPageIndex > -1 && nextPageIndex < pageOrder.length) {
            return pageOrder[nextPageIndex];
        }
    }

    return null;
};

// For batching only. Returns new actions
const getGoForwardActions = (lastPage: Page, state: State): AnyAction[] => {
    const actions = [];

    const currentSelectionIndex = getCurrentSelectionIndex(state);
    const currentUploadIndex = getCurrentUploadIndex(state);
    actions.push(updatePageHistory(lastPage, currentSelectionIndex, currentUploadIndex));

    const nextPage = getNextPage(lastPage, 1);
    if (nextPage) {
        actions.push(selectPage(lastPage, nextPage));
    }

    return actions;
};

export default [
    goBackLogic,
    goForwardLogic,
    loadFilesLogic,
    openFilesLogic,
    getFilesInFolderLogic,
    selectBarcodeLogic,
    selectPageLogic,
];
