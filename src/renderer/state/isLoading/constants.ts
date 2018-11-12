import { makeConstant } from "../util";

const BRANCH_NAME = "isLoading";

export const START_LOADING = makeConstant(BRANCH_NAME, "start-loading");
export const STOP_LOADING = makeConstant(BRANCH_NAME, "stop-loading");
