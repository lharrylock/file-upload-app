import { makeConstant } from "../util";

const BRANCH_NAME = "selection";

export const ADD_STAGE_FILES = makeConstant(BRANCH_NAME, "add-stage-files");
export const CLEAR_STAGED_FILES = makeConstant(BRANCH_NAME, "clear-staged-files");
export const DESELECT_FILE = makeConstant(BRANCH_NAME, "deselect-file");
export const LOAD_FILES = makeConstant(BRANCH_NAME, "load-files");
export const SELECT_FILE = makeConstant(BRANCH_NAME, "select-file");
export const SELECT_METADATA = makeConstant(BRANCH_NAME, "select_metadata");
