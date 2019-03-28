import { difference, includes, last } from "lodash";
import { createSelector } from "reselect";

import { State } from "../types";

import { AppEvent, AsyncRequestType } from "./types";

// BASIC SELECTORS
export const getIsLoading = (state: State) => state.feedback.isLoading;
export const getAlert = (state: State) => state.feedback.alert;
export const getRequestsInProgress = (state: State) => state.feedback.requestsInProgress;
export const getRequestsInProgressContains = (state: State, request: AsyncRequestType) => {
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
], (requestsInProgress: AsyncRequestType[]) => {
    const uploadRequests = [
        AsyncRequestType.START_UPLOAD,
        AsyncRequestType.COPY_FILES,
        AsyncRequestType.UPLOAD_METADATA,
    ];
    return difference(uploadRequests, requestsInProgress).length < uploadRequests.length; // todo better way?
});
