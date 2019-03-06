import {
    applyMiddleware,
    combineReducers,
    createStore,
} from "redux";
import { createLogicMiddleware } from "redux-logic";
import { SinonStub } from "sinon";

import {
    enableBatching,
    feedback,
    metadata,
    selection,
    State,
    upload,
} from "../";

export interface ReduxLogicDependencies {
    baseMmsUrl: string;
    httpClient: {
        get: SinonStub,
        post: SinonStub,
    };
}

const reducers = {
    feedback: feedback.reducer,
    metadata: metadata.reducer,
    selection: selection.reducer,
    upload: upload.reducer,
};

const logics = [
    ...metadata.logics,
    ...selection.logics,
    ...upload.logics,
];

export function createMockReduxStore(initialState: State, reduxLogicDependencies: ReduxLogicDependencies) {
    const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);
    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(combineReducers(reducers));

    if (initialState) {
        return createStore(rootReducer, initialState, middleware);
    }
    return createStore(rootReducer, middleware);
}
