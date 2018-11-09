import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxProcessDeps } from "../types";

import { receiveMetadata } from "./actions";
import { REQUEST_METADATA } from "./constants";

const requestMetadata = createLogic({
    process: (deps: ReduxProcessDeps) => {
        const {
            baseApiUrl,
            httpClient,
        } = deps;

        return httpClient
            .get(`${baseApiUrl}/metadata`)
            .then((metadata: AxiosResponse) => metadata.data)
            .catch((reason) => {
                console.log(reason); // tslint:disable-line:no-console
            });
    },
    processOptions: {
        successType: receiveMetadata,
    },
    type: REQUEST_METADATA,
});

export default [
    requestMetadata,
];
