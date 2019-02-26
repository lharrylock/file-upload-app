import { AicsGridCell } from "aics-react-labkey";
import { ASSOCIATE_FILE_AND_WELL } from "./constants";
import { AssociateFileAndWellAction } from "./types";

export function associateFileAndWell(fullPath: string, wellId: number, cell: AicsGridCell): AssociateFileAndWellAction {
    return {
        payload: {
            cell,
            fullPath,
            wellId,
        },
        type: ASSOCIATE_FILE_AND_WELL,
    };
}
