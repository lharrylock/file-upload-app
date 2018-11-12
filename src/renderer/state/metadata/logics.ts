import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDependencies } from "../types";

import { receiveMetadata } from "./actions";
import { REQUEST_METADATA } from "./constants";

const requestMetadata = createLogic({
    process: ({baseMmsUrl, httpClient}: ReduxLogicDependencies) => {

        return httpClient
            .get(`${baseMmsUrl}/metadata`)
            .then((metadata: AxiosResponse) => metadata.data)
            .catch((reason: any) => {
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
