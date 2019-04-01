import { ipcRenderer } from "electron";
import { createLogic } from "redux-logic";
import { UploadResponse } from "../../../main/file-storage-service-client/types";
import { START_UPLOAD, UPLOAD_FAILED, UPLOAD_FINISHED } from "../../../shared/constants";

import { getWellLabel } from "../../util";
import { addEvent, addRequestToInProgress, removeRequestFromInProgress, setAlert } from "../feedback/actions";
import { AlertType, AsyncRequestType } from "../feedback/types";
import { deselectFiles } from "../selection/actions";
import { getSelectedBarcode, getWell } from "../selection/selectors";
import { ReduxLogicDependencies, ReduxLogicDoneCb, ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILES_AND_WELL, INITIATE_UPLOAD } from "./constants";
import { getUpload } from "./selectors";

const associateFileAndWellLogic = createLogic({
    transform: ({action, getState}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        const state = getState();
        action.payload = {
            ...action.payload,
            barcode: getSelectedBarcode(state),
            wellLabel: getWellLabel(getWell(state)),
        };
        next(batchActions([
            action,
            deselectFiles(),
        ]));
    },
    type: ASSOCIATE_FILES_AND_WELL,
});

const initiateUploadLogic = createLogic({
    process: ({getState}: ReduxLogicDependencies, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        ipcRenderer.send(START_UPLOAD, getUpload(getState()));
        ipcRenderer.on(UPLOAD_FINISHED, (event: Event, result: UploadResponse) => {
            // tslint:disable-next-line
            dispatch(batchActions([
                removeRequestFromInProgress(AsyncRequestType.START_UPLOAD),
                addEvent("Upload Finished", AlertType.SUCCESS, new Date()),
            ]));

            done();
        });
        ipcRenderer.on(UPLOAD_FAILED, (event: Event, error: any) => {
            dispatch(batchActions([
                removeRequestFromInProgress(AsyncRequestType.START_UPLOAD),
                setAlert({
                    message: "Upload Failed" + error,
                    type: AlertType.ERROR,
                }),
            ]));

            done();
        });
    },
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            addEvent("Starting upload", AlertType.INFO, new Date()),
            addRequestToInProgress(AsyncRequestType.START_UPLOAD),
            action,
        ]));
    },
    type: INITIATE_UPLOAD,
});

export default [
    associateFileAndWellLogic,
    initiateUploadLogic,
];
