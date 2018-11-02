import {
    GET_PLATE_FROM_BARCODE,
    SET_WELLS,
} from "./constants";
import {
    GetPlateFromBarcodeAction, SetWellsAction, Well,
} from "./types";

export function getPlateFromBarcode(barcode: string): GetPlateFromBarcodeAction {
    return {
        payload: barcode,
        type: GET_PLATE_FROM_BARCODE,
    };
}

export function setWells(wells: Well[][]): SetWellsAction {
    return {
        payload: wells,
        type: SET_WELLS,
    };
}
