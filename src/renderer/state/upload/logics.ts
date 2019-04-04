import { UploadResponse } from "@aics/aicsfiles/type-declarations/types";
import { ipcRenderer } from "electron";
import { createLogic } from "redux-logic";

import { START_UPLOAD, UPLOAD_FAILED, UPLOAD_FINISHED } from "../../../shared/constants";
import { getWellLabel } from "../../util";
import { addEvent, addRequestToInProgress, removeRequestFromInProgress, setAlert } from "../feedback/actions";
import { AlertType, AsyncRequest } from "../feedback/types";
import { deselectFiles } from "../selection/actions";
import { getSelectedBarcode, getWell } from "../selection/selectors";
import { ReduxLogicDependencies, ReduxLogicDoneCb, ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILES_AND_WELL, INITIATE_UPLOAD } from "./constants";
import { getUploadPayload } from "./selectors";

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
        ipcRenderer.send(START_UPLOAD, getUploadPayload(getState()));
        ipcRenderer.on(UPLOAD_FINISHED, (event: Event, result: UploadResponse) => {
            // tslint:disable-next-line
            console.log("event", event);
            // tslint:disable-next-line
            console.log("result", result);
            // tslint:disable-next-line
            dispatch(batchActions([
                removeRequestFromInProgress(AsyncRequest.START_UPLOAD),
                addEvent("Upload Finished", AlertType.SUCCESS, new Date()),
            ]));

            done();
        });
        ipcRenderer.on(UPLOAD_FAILED, (event: Event, error: any) => {
            // tslint:disable-next-line
            console.log(error);
            dispatch(batchActions([
                removeRequestFromInProgress(AsyncRequest.START_UPLOAD),
                setAlert({
                    message: "Upload Failed" + error.message,
                    type: AlertType.ERROR,
                }),
            ]));

            done();
        });
    },
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            addEvent("Starting upload", AlertType.INFO, new Date()),
            addRequestToInProgress(AsyncRequest.START_UPLOAD),
            action,
        ]));
    },
    type: INITIATE_UPLOAD,
});

export default [
    associateFileAndWellLogic,
    initiateUploadLogic,
];
