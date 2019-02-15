import axios from "axios";
import {
    applyMiddleware,
    combineReducers,
    createStore,
} from "redux";
import { createLogicMiddleware } from "redux-logic";

import { MMS_BASE_URL } from "../constants";

import {
    enableBatching,
    feedback,
    metadata,
    selection,
    State,
} from "./";

const reducers = {
    feedback: feedback.reducer,
    metadata: metadata.reducer,
    selection: selection.reducer,
};

const logics = [
    ...feedback.logics,
    ...metadata.logics,
    ...selection.logics,
];

export const reduxLogicDependencies = {
    baseMmsUrl: MMS_BASE_URL,
    httpClient: axios,
};

export default function createReduxStore(initialState?: State) {
    const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);
    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(combineReducers(reducers));

    if (initialState) {
        return createStore(rootReducer, initialState, middleware);
    }

    return createStore(rootReducer, middleware);
}
