import { makeConstant } from "../util";

const BRANCH_NAME = "selection";

export const ADD_STAGE_FILES = makeConstant(BRANCH_NAME, "add-stage-files");
export const DESELECT_FILE = makeConstant(BRANCH_NAME, "deselect-file");
export const SELECT_BARCODE = makeConstant(BRANCH_NAME, "select-barcode");
export const SELECT_FILE = makeConstant(BRANCH_NAME, "select-file");
export const SELECT_METADATA = makeConstant(BRANCH_NAME, "select-metadata");
export const LOAD_FILES = makeConstant(BRANCH_NAME, "load-files");
export const OPEN_FILES = makeConstant(BRANCH_NAME, "open-files");
export const SELECT_PAGE = makeConstant(BRANCH_NAME, "select-page");
export const UPDATE_STAGED_FILES = makeConstant(BRANCH_NAME, "update-staged-files");
export const GET_FILES_IN_FOLDER = makeConstant(BRANCH_NAME, "get-files-in-folder");
export const SET_WELLS = makeConstant(BRANCH_NAME, "set_wells");

export const API_WAIT_TIME_SECONDS = 60;
