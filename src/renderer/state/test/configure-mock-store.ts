import {
    applyMiddleware,
    combineReducers,
    createStore,
} from "redux";
import { createLogicMiddleware } from "redux-logic";
import { SinonStub } from "sinon";

import {
    enableBatching,
    isLoading,
    metadata,
    selection,
    State,
} from "../";

export interface ReduxLogicDependencies {
    baseMmsUrl: string;
    httpClient: {
        get: SinonStub,
        post: SinonStub,
    };
}

const reducers = {
    isLoading: isLoading.reducer,
    metadata: metadata.reducer,
    selection: selection.reducer,
};

const logics = [
    ...metadata.logics,
    ...selection.logics,
];

export function createReduxStore(initialState: State, reduxLogicDependencies: ReduxLogicDependencies) {
    const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);
    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(combineReducers(reducers));

    if (initialState) {
        return createStore(rootReducer, initialState, middleware);
    }
    return createStore(rootReducer, middleware);
}
