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

const MAX_ROWS = 26;

/***
 * Returns a human readable label representing the row and column of a well on a plate.
 * Assumes plate does not have more than 26 rows.
 * @param well
 * @param noneText
 */
export function getWellLabel(well?: AicsGridCell, noneText: string = "None"): string {
    if (!well) {
        return noneText;
    }

    if (well.row < 0 || well.col < 0) {
        throw Error("Well row and col cannot be negative!");
    }

    // row and col are zero-based indexes
    if (well.row > MAX_ROWS - 1) {
        throw Error(`Well row cannot exceed ${MAX_ROWS}`);
    }

    const row = String.fromCharCode(97 +  (well.row % 26)).toUpperCase();
    const col = well.col + 1;
    return `${row}${col}`;
}

export {
    LabkeyQueryService,
};
