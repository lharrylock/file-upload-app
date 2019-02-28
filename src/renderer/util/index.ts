import { AicsGridCell } from "aics-react-labkey";
import {
    forOwn,
    isFunction,
} from "lodash";

import LabkeyQueryService from "./labkey-query-service";

export function bindAll<T>(obj: T, methods: Array<() => any>) {
    const setOfMethods = new Set(methods);
    forOwn(obj.constructor.prototype, (value, key) => {
        if (setOfMethods.has(value) && isFunction(value)) {
            Object.assign(obj, { [key]: value.bind(obj) });
        }
    });
}

export function getWellDisplay(well?: AicsGridCell): string {
    if (!well) {
        return "None";
    }

    const row = String.fromCharCode(97 +  (well.row % 26)).toUpperCase();
    const col = well.col + 1;
    return `${row}${col}`;
}

export {
    LabkeyQueryService,
};
