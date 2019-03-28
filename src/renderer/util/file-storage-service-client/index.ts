import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
    AicsSuccessResponse,
    CopyCallback, FSSRequestFile, FSSResponseFile,
    StartUploadResponse,
    UploadMetadataRequest,
    UploadMetadataResponse,
    Uploads
} from "./types";

export default class FileStorageServiceClient {
    private static convertToFileRequests(files: Uploads): FSSRequestFile[] {
        const result: FSSRequestFile[] = [];
        for (const key in files) {
            if (files.hasOwnProperty(key)) {
                const metadata = files[key];
                result.push({
                    file_name: key,
                    file_type: "txt", // todo
                    md5hex: "hex", // todo
                    metadata,
                });
            }
        }

        return result;
    }

    private readonly baseUrl: string;

    constructor(host: string) { // todo: take enums instead?
        this.baseUrl = `${host}/fss/1.0/file`;
    }

    public async upload(files: Uploads, copy: CopyCallback): Promise<string[]> {
        const {
            "job_id": jobId,
            "upload_directory": uploadDirectory,
        }: StartUploadResponse = await this.startUpload();

        await copy(uploadDirectory, jobId); // handle error while copying

        const uploadMetadataResp: UploadMetadataResponse = await this.uploadMetadata(jobId, files);
        return uploadMetadataResp.files.map((file: FSSResponseFile) => file.read_path);
    }

    private async startUpload(): Promise<StartUploadResponse> {
        const config: AxiosRequestConfig = {
            headers: {
                "X-User-Id": "lisah", // TODO!
            },
        };
        const response: AxiosResponse<AicsSuccessResponse<StartUploadResponse>> = await
            axios.post(`${this.baseUrl}/upload`, null, config)
                .catch((err) => {
                    // tslint:disable-next-line
                    console.error("start upload failed", err); // todo handle this
                }) as AxiosResponse<AicsSuccessResponse<StartUploadResponse>>; // todo better way?
        const data: StartUploadResponse[] = response.data.data;
        return data[0];
    }

    private async uploadMetadata(jobId: string, files: Uploads): Promise<UploadMetadataResponse> {
        const request: UploadMetadataRequest = {
            files: FileStorageServiceClient.convertToFileRequests(files),
            job_id: jobId,
        };

        const response: AxiosResponse<AicsSuccessResponse<UploadMetadataResponse>> = await
            axios.post(`${this.baseUrl}/uploadComplete`, request)
                .catch((err) => {
                    // tslint:disable-next-line
                    console.error("upload metadata failed", err); // todo handle this
                }) as AxiosResponse<AicsSuccessResponse<UploadMetadataResponse>>;
        return response.data.data[0];
    }
}
