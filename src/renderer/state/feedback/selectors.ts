import { difference, includes, last } from "lodash";
import { createSelector } from "reselect";

import { State } from "../types";

import { AppEvent, AsyncRequest } from "./types";

// BASIC SELECTORS
export const getIsLoading = (state: State) => state.feedback.isLoading;
export const getAlert = (state: State) => state.feedback.alert;
export const getRequestsInProgress = (state: State) => state.feedback.requestsInProgress;
export const getRequestsInProgressContains = (state: State, request: AsyncRequest) => {
    const requestsInProgress = getRequestsInProgress(state);
    return includes(requestsInProgress, request);
};
export const getEvents = (state: State) => state.feedback.events;

// COMPOSED SELECTORS
export const getRecentEvent = createSelector([
    getEvents,
], (events: AppEvent[]) => last(events));

export const getUploadInProgress = createSelector([
    getRequestsInProgress,
], (requestsInProgress: AsyncRequest[]) => {
    const uploadRequests = [
        AsyncRequest.START_UPLOAD,
        AsyncRequest.COPY_FILES,
        AsyncRequest.UPLOAD_METADATA,
    ];
    return difference(uploadRequests, requestsInProgress).length < uploadRequests.length; // todo better way?
});
