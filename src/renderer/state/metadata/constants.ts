import { makeConstant } from "../util";

const BRANCH_NAME = "metadata";

export const RECEIVE_METADATA = makeConstant(BRANCH_NAME, "receive");
export const REQUEST_METADATA = makeConstant(BRANCH_NAME, "request");
