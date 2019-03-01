import { createLogic } from "redux-logic";
import { deselectFile } from "../selection/actions";
import { ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILES_AND_WELL } from "./constants";

const associateFileAndWellLogic = createLogic({
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
            deselectFile(action.payload.fullPaths),
        ]));
    },
    type: ASSOCIATE_FILES_AND_WELL,
});

export default [
    associateFileAndWellLogic,
];
