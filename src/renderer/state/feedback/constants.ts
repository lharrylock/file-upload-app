import { makeConstant } from "../util";

const BRANCH_NAME = "feedback";

export const START_LOADING = makeConstant(BRANCH_NAME, "start-loading");
export const STOP_LOADING = makeConstant(BRANCH_NAME, "stop-loading");
