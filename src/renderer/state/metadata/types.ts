import { Unit } from "../selection/types";

export interface MetadataStateBranch {
    [key: string]: any;
    units?: Unit[];
}

export interface ReceiveMetadataAction {
    payload: MetadataStateBranch;
    type: string;
}

export interface RequestMetadataAction {
    type: string;
}

export interface LabkeyUnit {
    Type: string;
    Description: string;
    UnitsId: number;
    Name: string;
}
