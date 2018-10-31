import {
    GET_PLATE_FROM_BARCODE,
} from "./constants";
import {
    GetPlateFromBarcodeAction,
} from "./types";

export function getPlateFromBarcode(barcode: string): GetPlateFromBarcodeAction {
    return {
        payload: barcode,
        type: GET_PLATE_FROM_BARCODE,
    };
}
