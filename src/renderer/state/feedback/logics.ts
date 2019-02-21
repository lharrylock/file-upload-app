import { createLogic } from "redux-logic";

import { HTTP_STATUS, ReduxLogicNextCb, ReduxLogicTransformDependencies } from "../types";

import { SET_ALERT } from "./constants";

export const httpStatusToMessage: Map<number, string> = new Map([
    [HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unknown error from server"],
    [HTTP_STATUS.BAD_GATEWAY, "Bad Gateway Error: Labkey or MMS is down."],
]);

const setAlertLogic = createLogic({
    transform: ({ action }: ReduxLogicTransformDependencies, next: ReduxLogicNextCb) => {
        const { payload } = action;
        const updatedPayload = { ...payload };

        if (httpStatusToMessage.has(payload.statusCode) && !payload.message) {
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
