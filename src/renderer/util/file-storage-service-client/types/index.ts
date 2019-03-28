import { AicsResponse } from "../../../state/types";

export interface StartUploadResponse {
    job_id: string;
    upload_directory: string;
}

export interface UploadMetadataResponse {
    job_id: string;
    files: FSSResponseFile[];
}

export interface FSSResponseFile {
    file_name: string;
    file_id: string;
    read_path: string;
}

export interface FSSRequestFile {
    file_name: string;
    md5hex: string;
    file_type: string;
    metadata: any;
}

export interface UploadMetadataRequest {
    job_id: string;
    files: FSSRequestFile[];
}

export interface Uploads {
    [filePath: string]: any;
}

export type CopyCallback = (uploadDirectory: string, jobId: string) => Promise<boolean>; // todo description

export interface AicsSuccessResponse<T> extends AicsResponse {
    data: T[];
    totalCount: number;
    hasMore?: boolean;
    offset: number;
}

export interface AicsErrorResponse extends AicsResponse {
    error: string; // todo
}
