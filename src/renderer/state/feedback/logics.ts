import { createLogic } from "redux-logic";

import { ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";

import { SET_ALERT } from "./constants";

const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_GATEWAY = 502;

const httpStatusToMessage: Map<number, string> = new Map([
    [HTTP_STATUS_INTERNAL_SERVER_ERROR, "Unknown error from server"],
    [HTTP_STATUS_BAD_GATEWAY, "Bad Gateway Error: Labkey or MMS is down."],
]);

const setAlertLogic = createLogic({
    transform: ({ action }: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        const { payload } = action;
        const updatedPayload = { ...payload };

        if (httpStatusToMessage.has(payload.statusCode)) {
            updatedPayload.message = httpStatusToMessage.get(payload.statusCode);
        }

        next({
            ...action,
            payload: updatedPayload,
        });
    },
    type: SET_ALERT,
});

export default [
   setAlertLogic,
];
