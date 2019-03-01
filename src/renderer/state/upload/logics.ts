import { createLogic } from "redux-logic";
import { deselectFiles } from "../selection/actions";
import { ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILES_AND_WELL } from "./constants";

const associateFileAndWellLogic = createLogic({
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
            deselectFiles(),
        ]));
    },
    type: ASSOCIATE_FILES_AND_WELL,
});

export default [
    associateFileAndWellLogic,
];
