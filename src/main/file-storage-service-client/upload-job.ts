import crypto from "crypto";
import fs from "fs-extra";
import { values } from "lodash";
import path from "path";

import { FSSConnection } from "./FSSConnection";
import { JobStatus } from "./job-status";
import {
    AicsSuccessResponse,
    FSSRequestFile,
    FSSResponseFile,
    StartUploadResponse,
    UploadMetadataResponse
} from "./types";

export class UploadJob {
    public resultFiles: FSSResponseFile[] = [];

    private readonly fss: FSSConnection;
    private sourceFiles: {[file: string]: FSSRequestFile} = {};
    private jobId!: string;
    private uploadDirectory!: string;

    constructor(fss: FSSConnection) {
        this.fss = fss;
    }

    public async startUpload(): Promise<void> {
        const response: AicsSuccessResponse<StartUploadResponse> = await
            this.fss.post("1.0/file/upload", null)
                .catch((err) => {
                    // tslint:disable-next-line
                    console.error("start upload failed", err); // todo handle this
                }) as AicsSuccessResponse<StartUploadResponse>;
        const jsonData: StartUploadResponse[] = response.data;
        const { jobId, uploadDirectory } = jsonData[0];
        this.jobId = jobId;
        this.uploadDirectory = uploadDirectory;
    }

    /***
     * Add files to the upload job, along with their metadata.
     *
     * Return the number of files copied
     */
    public async copy(sourceFile: string, metadata: any): Promise<number> { // todo type for metadata
        // consistent between OS's
        console.log(sourceFile);
        const basename = path.posix.basename(sourceFile);

        // check that we have not already processed this file
        if (this.sourceFiles[basename]) {
            throw new Error(`File ${basename} already exists in this upload set!`);
        }

        // check that uploadDirectory/jobId exists

        const md5Hash = await this.copyWithChecksum(sourceFile);
        metadata = {
            ...metadata,
            file: {
                ...metadata.file,
                fileName: basename,
                originalPath: sourceFile,
            },
        };

        const { fileType } = metadata.file;
        if (!fileType) {
            throw new Error(`Metadata for file ${sourceFile} must have fileType defined`);
        }

        this.sourceFiles[basename] = {
            fileName: basename,
            fileType,
            md5hex: md5Hash,
            metadata,
        };

        return 1; // todo: is this necessary?
    }

    public async copyComplete(): Promise<JobStatus> {
        const request = {
            files: values(this.sourceFiles),
            jobId: this.jobId,
        };
        const jsonData: AicsSuccessResponse<UploadMetadataResponse> =
            await this.fss.post("1.0/file/uploadComplete", request);
        this.resultFiles = jsonData.data[0].files;
        return new JobStatus(this.fss, this.jobId);
    }

    private async copyWithChecksum(sourceFile: string): Promise<string> {
        // source: https://blog.abelotech.com/posts/calculate-checksum-hash-nodejs-javascript/
        const hash = crypto.createHash("md5");
        let result = "";
        const stream = fs.createReadStream(sourceFile);
        stream.on("data", (data: string) => hash.update(data, "utf8"));
        stream.on("end", () => result = hash.digest("hex"));
        await fs.copyFile(sourceFile, this.uploadDirectory)
            .catch((err) => {
                if (err) {
                    throw err;
                }
            });
        return result;
    }
}
