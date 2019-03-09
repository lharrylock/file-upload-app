import { Page } from "../selection/types";

export interface MetadataStateBranch {
    units: Unit[];
    history: {
        selection: PageToIndexMap;
        upload: PageToIndexMap;
    };
}

export interface PageToIndexMap {
    [page: string]: number;
}

export interface ReceiveMetadataAction {
    payload: MetadataStateBranch;
    type: string;
}

export interface RequestMetadataAction {
    type: string;
}

export interface UpdatePageHistoryMapAction {
    payload: {
        selection: {
            [page: string]: number,
        },
        upload: {
            [page: string]: number,
        },
    };
    type: string;
}

export interface Unit {
    description: string;
    name: string;
    type: string;
    unitsId: number;
}

export interface LabkeyUnit {
    Type: string;
    Description: string;
    UnitsId: number;
    Name: string;
}
