import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";
import { ASSOCIATE_FILES_AND_WELL, UNDO_FILE_WELL_ASSOCIATION } from "./constants";
import { AssociateFilesAndWellAction, UndoFileWellAssociationAction, UploadStateBranch } from "./types";

export const initialState = {

};

const actionToConfigMap: TypeToDescriptionMap = {
    [ASSOCIATE_FILES_AND_WELL]: {
        accepts: (action: AnyAction): action is AssociateFilesAndWellAction => action.type === ASSOCIATE_FILES_AND_WELL,
        perform: (state: UploadStateBranch, action: AssociateFilesAndWellAction) => {
            const nextState = {...state};

            return action.payload.fullPaths.reduce((accum: UploadStateBranch, fullPath: string) => {
                return {
                    ...accum,
                    [fullPath]: {
                        ...accum[fullPath],
                        wellId: action.payload.wellId,
                    },
                };
            }, nextState);
        },
    },
    [UNDO_FILE_WELL_ASSOCIATION]: {
        accepts: (action: AnyAction): action is UndoFileWellAssociationAction =>
            action.type === UNDO_FILE_WELL_ASSOCIATION,
        perform: (state: UploadStateBranch, action: UndoFileWellAssociationAction) => ({
            ...state,
            [action.payload]: {
                ...state[action.payload],
                wellId: undefined,
            },
        }),
    },
};

export default makeReducer<UploadStateBranch>(actionToConfigMap, initialState);
