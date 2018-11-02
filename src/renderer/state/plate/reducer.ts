import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    SET_WELLS,
} from "./constants";
import {
    PlateStateBranch,
    SetWellsAction,
} from "./types";

export const initialState: PlateStateBranch = {

};

const actionToConfigMap: TypeToDescriptionMap = {
    [SET_WELLS]: {
        accepts: (action: AnyAction): action is SetWellsAction => action.type === SET_WELLS,
        perform: (state: PlateStateBranch, action: SetWellsAction) => {
            return {
                wells: action.payload,
            };
        },
    },
};

export default makeReducer<PlateStateBranch>(actionToConfigMap, initialState);
