import { createLogic } from "redux-logic";
import { clearSelection } from "../selection/actions";
import { ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";
import { batchActions } from "../util";
import { ASSOCIATE_FILES_AND_WELL } from "./constants";

const associateFileAndWellLogic = createLogic({
    transform: ({action}: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
            clearSelection("files"),
        ]));
    },
    type: ASSOCIATE_FILES_AND_WELL,
});

export default [
    associateFileAndWellLogic,
];
