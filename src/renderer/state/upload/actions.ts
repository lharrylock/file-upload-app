import { AicsGridCell } from "aics-react-labkey";
import { ASSOCIATE_FILE_AND_WELL, UNDO_FILE_WELL_ASSOCIATION } from "./constants";
import { AssociateFileAndWellAction, UndoFileWellAssociationAction } from "./types";

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

export function undoFileWellAssociation(fullPath: string): UndoFileWellAssociationAction {
    return {
        payload: fullPath,
        type: UNDO_FILE_WELL_ASSOCIATION,
    };
}
