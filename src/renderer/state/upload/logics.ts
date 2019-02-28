import { createLogic } from "redux-logic";
import { deselectFile, deselectWellsForUpload } from "../selection/actions";
import { ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILE_AND_WELL } from "./constants";

const associateFileAndWellLogic = createLogic({
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
            deselectFile(action.payload.fullPath),
        ]));
    },
    type: ASSOCIATE_FILE_AND_WELL,
});

export default [
    associateFileAndWellLogic,
];
