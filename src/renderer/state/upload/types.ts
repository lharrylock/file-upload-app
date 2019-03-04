export interface UploadStateBranch {
    [fullPath: string]: UploadMetadata;
}

// Metadata associated with a file
export interface UploadMetadata {
    wellId: number;
}

export interface AssociateFilesAndWellAction {
    payload: {
        fullPaths: string[],
        wellId: number,
    };
    type: string;
}

export interface UndoFileWellAssociationAction {
    payload: string;
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

// All tags representing wells should share the same color
export class WellFileTag implements FileTag {
    public title: string;
    public readonly color: string;

    constructor(title: string) {
        this.title = title;
        this.color = "magenta";
    }
}
