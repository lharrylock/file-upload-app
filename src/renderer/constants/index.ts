import { isEmpty } from "lodash";

export const APP_ID = "app";

const {
    LIMS_PROTOCOL = "http",
    LIMS_HOST = "localhost",
    LIMS_PORT = "8080",
    NODE_ENV,
} = process.env;

const HOST = NODE_ENV === "production" ? LIMS_HOST : `${LIMS_HOST}:${LIMS_PORT}`;

export const LABKEY_URL = `${LIMS_PROTOCOL}://${HOST}/labkey`;
export const LABKEY_SELECT_ROWS_URL = (schema: string, table: string, additionalQueries: string[] = []) => {
    const base = `${LABKEY_URL}/AICS/query-selectRows.api?schemaName=${schema}&query.queryName=${table}`;
    if (!isEmpty(additionalQueries)) {
        return `${base}&${additionalQueries.join("&")}`;
    }

    return base;
};

// Metadata Management Service
export const MMS_BASE_URL = `${LIMS_PROTOCOL}://${HOST}/metadata-management-service`;

// Labkey Schemas
export const LK_MICROSCOPY_SCHEMA = "microscopy";
