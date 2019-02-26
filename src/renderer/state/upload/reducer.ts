import { AnyAction } from "redux";
import { SelectionStateBranch } from "../selection/types";
import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";
import { ASSOCIATE_FILE_AND_WELL } from "./constants";
import { AssociateFileAndWellAction, UploadStateBranch } from "./types";

export const initialState = {

};

const actionToConfigMap: TypeToDescriptionMap = {
    [ASSOCIATE_FILE_AND_WELL]: {
        accepts: (action: AnyAction): action is AssociateFileAndWellAction => action.type === ASSOCIATE_FILE_AND_WELL,
        perform: (state: SelectionStateBranch, action: AssociateFileAndWellAction) => ({
            ...state,
            [action.payload.fullPath]: {
                ...state[action.payload.fullPath],
                wellId: action.payload.wellId,
            },
        }),
    },
};

export default makeReducer<UploadStateBranch>(actionToConfigMap, initialState);
