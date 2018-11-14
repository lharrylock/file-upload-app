import { isEmpty } from "lodash";

export const APP_ID = "file-upload-app";
export const MMS_VERSION = "1.0";
export const MMS_BASE_URL = `/metadata-management-service/${MMS_VERSION}`;
// TODO: replace host with env variable?
export const LABKEY_URL = `http://aics.corp.alleninstitute.org/labkey`;
export const LABKEY_SELECT_ROWS_URL = (schema: string, table: string, additionalQueries: string[] = []) => {
    const base = `${LABKEY_URL}/AICS/query-selectRows.api?schemaName=${schema}&query.queryName=${table}`;
    if (!isEmpty(additionalQueries)) {
        return `${base}&${additionalQueries.join("&")}`;
    }

    return base;
};
