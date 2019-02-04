import { isEmpty } from "lodash";

export const APP_ID = "file-upload-app";

const {
    LABKEY_PROTOCOL = "http",
    LABKEY_HOST = "localhost",
    LABKEY_PORT = "8080",
    MMS_PROTOCOL = "http",
    MMS_HOST = "localhost",
    MMS_PORT = "8080",
} = process.env;

export const LABKEY_URL = `${LABKEY_PROTOCOL}://${LABKEY_HOST}:${LABKEY_PORT}/labkey`;
export const LABKEY_SELECT_ROWS_URL = (schema: string, table: string, additionalQueries: string[] = []) => {
    const base = `${LABKEY_URL}/AICS/query-selectRows.api?schemaName=${schema}&query.queryName=${table}`;
    if (!isEmpty(additionalQueries)) {
        return `${base}&${additionalQueries.join("&")}`;
    }

    return base;
};

// Metadata Management Service
export const MMS_BASE_URL = `${MMS_PROTOCOL}://${MMS_HOST}:${MMS_PORT}/metadata-management-service`;
