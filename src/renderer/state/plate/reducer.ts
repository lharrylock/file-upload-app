import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    GET_PLATE_FROM_BARCODE,
} from "./constants";
import {
    GetPlateFromBarcodeAction,
    PlateStateBranch,
} from "./types";

export const initialState = {
    wells: [[]],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [GET_PLATE_FROM_BARCODE]: {
        accepts: (action: AnyAction): action is GetPlateFromBarcodeAction => action.type === GET_PLATE_FROM_BARCODE,
        perform: (state: PlateStateBranch, action: GetPlateFromBarcodeAction) => {
            // todo remove this block. just here as example
            return {
                ...state,
            };
        },
    },
};

export default makeReducer<PlateStateBranch>(actionToConfigMap, initialState);
