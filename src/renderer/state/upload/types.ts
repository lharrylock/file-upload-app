import { AicsGridCell } from "aics-react-labkey";

export interface UploadStateBranch {
    [fullPath: string]: UploadMetadata;
}

export interface UploadMetadata {
    wellId: number;
}

export interface AssociateFileAndWellAction {
    payload: {
        cell: AicsGridCell,
        fullPath: string,
        wellId: number,
    };
    type: string;
}
