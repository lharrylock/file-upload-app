import { isEmpty } from "lodash";

export const APP_ID = "file-upload-app";

// Metadata Management Service
export const MMS_VERSION = "1.0";
// todo: use env variables?
export const MMS_BASE_URL = `http://localhost:8080/metadata-management-service/${MMS_VERSION}`;

// Labkey
const {
    LABKEY_PROTOCOL = "http",
    LABKEY_HOST = "localhost",
    LABKEY_PORT = "8080",
} = process.env;
export const LABKEY_URL = `${LABKEY_PROTOCOL}://${LABKEY_HOST}:${LABKEY_PORT}/labkey`;
export const LABKEY_SELECT_ROWS_URL = (schema: string, table: string, additionalQueries: string[] = []) => {
    const base = `${LABKEY_URL}/AICS/query-selectRows.api?schemaName=${schema}&query.queryName=${table}`;
    if (!isEmpty(additionalQueries)) {
        return `${base}&${additionalQueries.join("&")}`;
    }

    return base;
};
