import { makeConstant } from "../util";

const BRANCH_NAME = "upload";

export const ASSOCIATE_FILE_AND_WELL = makeConstant(BRANCH_NAME, "associate-file-and-well");
export const UNDO_FILE_WELL_ASSOCIATION = makeConstant(BRANCH_NAME, "undo-file-well-association");