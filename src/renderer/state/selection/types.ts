import { MetadataStateBranch } from "../metadata/types";

export interface File {
    name: string;
    files: File[] | null;
}

export interface DeselectFileAction {
    payload: File | File[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    files: File[];
}

export interface SelectFileAction {
    payload: File | File[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}
