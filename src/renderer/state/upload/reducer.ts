import { omit } from "lodash";
import { AnyAction } from "redux";
import undoable, {
    UndoableOptions,
} from "redux-undo";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";
import {
    ASSOCIATE_FILES_AND_WELL,
    CLEAR_UPLOAD_HISTORY,
    DELETE_UPLOAD,
    JUMP_TO_PAST_UPLOAD,
    JUMP_TO_UPLOAD,
    UNDO_FILE_WELL_ASSOCIATION
} from "./constants";
import {
    AssociateFilesAndWellAction,
    RemoveUploadsAction,
    UndoFileWellAssociationAction,
    UploadStateBranch
} from "./types";

export const initialState = {

};

const actionToConfigMap: TypeToDescriptionMap = {
    [ASSOCIATE_FILES_AND_WELL]: {
        accepts: (action: AnyAction): action is AssociateFilesAndWellAction => action.type === ASSOCIATE_FILES_AND_WELL,
        perform: (state: UploadStateBranch, action: AssociateFilesAndWellAction) => {
            const nextState = {...state};

            return action.payload.fullPaths.reduce((accum: UploadStateBranch, fullPath: string) => {
                const { barcode, wellId, wellLabel } = action.payload;
                return {
                    ...accum,
                    [fullPath]: {
                        ...accum[fullPath],
                        barcode,
                        wellId,
                        wellLabel,
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
    [DELETE_UPLOAD]: {
        accepts: (action: AnyAction): action is RemoveUploadsAction => action.type === DELETE_UPLOAD,
        perform: (state: UploadStateBranch, action: RemoveUploadsAction) => omit(state, action.payload),
    },
};

const upload = makeReducer<UploadStateBranch>(actionToConfigMap, initialState);

const options: UndoableOptions = {
    clearHistoryType: CLEAR_UPLOAD_HISTORY,
    jumpToPastType: JUMP_TO_PAST_UPLOAD,
    jumpType: JUMP_TO_UPLOAD,
    limit: 100,
};
export default undoable(upload, options);
