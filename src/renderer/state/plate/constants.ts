import { makeConstant } from "../util";

const BRANCH_NAME = "plate";

export const GET_PLATE_FROM_BARCODE = makeConstant(BRANCH_NAME, "get_plate_from_barcode");
export const SET_WELLS = makeConstant(BRANCH_NAME, "set_wells");
