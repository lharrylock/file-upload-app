export interface UploadStateBranch {
    [fullPath: string]: UploadMetadata;
}

// Metadata associated with a file
export interface UploadMetadata {
    barcode: string;
    wellId: number;
    wellLabel: string;
}

export interface UploadTableRow {
    barcode: string;
    file: string;
    key: string;
    wellLabel: string;
}

export interface AssociateFilesAndWellAction {
    payload: {
        barcode: string,
        fullPaths: string[],
        wellId: number,
        wellLabel: string,
    };
    type: string;
}

export interface UndoFileWellAssociationAction {
    payload: string;
    type: string;
}

export interface JumpToPastUploadAction {
    index: number;
    type: string;
}

export interface JumpToUploadAction {
    index: number;
    type: string;
}

export interface ClearUploadHistoryAction {
    type: string;
}

export interface UploadAction {
    type: string;
}

// Represents information needed to display an Antd Tag next to a file on the FolderTree.
// There will be a tag for each piece of metadata associated with a file.
export interface FileTag {
    // Tag text
    title: string;
    // Tag background color
    color: string;
}
