// Client types
export interface UploadClient {
    uploadFiles(metadata: Uploads): Promise<UploadResponse>;
}

export interface Uploads {
    [filePath: string]: UploadMetadata;
}

export interface UploadResponse {
    [originalPath: string]: FSSResponseFile;
}

// Common types
export interface AicsResponse {
    responseType: "SUCCESS" | "SERVER_ERROR" | "CLIENT_ERROR";
}

export interface AicsSuccessResponse<T> extends AicsResponse {
    data: T[];
    totalCount: number;
    hasMore?: boolean;
    offset: number;
}

export interface AicsErrorResponse extends AicsResponse {
    error: string; // todo
}

// FSS Request Types

export interface FSSRequestFile {
    fileName: string;
    md5hex: string;
    fileType: string;
    metadata: UploadMetadata;
}

export interface UploadMetadataRequest {
    jobId: string;
    files: FSSRequestFile[];
}

export interface UploadMetadata {
    fileName: string;
    fileType: string;
    md5hex: string;
    fileId: string;
    readPath: string;
    thumbnails?: Thumbnail;
    cell?: Cell;
    microscopy?: Microscopy;
    contentProcessing?: ContentProcessing;
}

export interface Thumbnail {
    [name: string]: {
        fileId: string;
        algorithm: {
            name: string;
            version: string;
        }
    };
}

export interface Cell {
    populationId?: number;
    lineId?: number;
    line?: string;
    clone?: string;
    passage?: number;
    stageId?: number;
    stage?: string;
    notes?: string;
    edits?: Array<{
        cas9Batch?: string;
        cas9?: string;
        crRnaBatch?: string;
        crRna?: string;
        donorPlasmidBatch?: string;
        donorPlasmid?: string;
        gene?: string;
        tagLocation?: string;
        fluorescentProtein?: string;
    }>;
    validationError?: string;
    systemError?: string;
}

export interface Microscopy {
    pipelineVersion?: string;
    plateId?: string;
    plateBarcode?: string;
    wellId?: number;
    wellName?: string;
    location?: number[];
    magnification?: number;
    imagingDate?: string;
    roiId?: number;
    fovId?: number;
    contentType?: string;
    sequence?: number;
    cellViability?: number;
    scorers?: Array<{
        user: string;
        score: string;
    }>;
}

export interface ContentProcessing {
    colonyIds?: number[];
    cellIds?: number[];
    channels?: Array<{
        algorithmid: number;
        algorithm: string;
        algorithmVersion: string;
        contentType: string;
        contentTypeId: string;
        processingDate: string;
        runId: number;
    }>;
}

// FSS Response Types

export interface StartUploadResponse {
    jobId: string;
    uploadDirectory: string;
}

export interface UploadMetadataResponse {
    jobId: string;
    files: FSSResponseFile[];
}

export interface FSSResponseFile {
    fileName: string;
    fileId: string;
    readPath: string;
    jobId: string; // todo: this was only defined in python codee
}
