import { AxiosError, AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { LABKEY_SELECT_ROWS_URL } from "../../constants";
import { LK_MICROSCOPY_SCHEMA } from "../../constants/index";

import { ReduxLogicDependencies } from "../types";

import { receiveMetadata } from "./actions";
import { REQUEST_METADATA } from "./constants";
import { LabkeyUnit, ReceiveMetadataAction, Unit } from "./types";

const requestMetadata = createLogic({
    process: ({baseMmsUrl, httpClient}: ReduxLogicDependencies, dispatch: (action: ReceiveMetadataAction) => void,
              done: () => void) => {
        const getUnitsURL = LABKEY_SELECT_ROWS_URL(LK_MICROSCOPY_SCHEMA, "Units");
        return Promise.all([
            httpClient.get(getUnitsURL),
        ])
            .then(([getUnitsResponse]: AxiosResponse[]) => {
                const units: Unit[] = getUnitsResponse.data.rows.map((unit: LabkeyUnit) => ({
                    description: unit.Description,
                    name: unit.Name,
                    type: unit.Type,
                    unitsId: unit.UnitsId,
                }));
                dispatch(receiveMetadata({
                    units,
                }));
            })
            .catch((reason: AxiosError) => {
                console.log(reason); // tslint:disable-line:no-console
                // todo: show alert
            })
            .then(done);
    },
    type: REQUEST_METADATA,
});

export default [
    requestMetadata,
];
