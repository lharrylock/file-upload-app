import crypto from "crypto";
import fs from "fs";
import { values } from "lodash";
import path from "path";
import { promisify } from "util";

import { FSSConnection } from "./FSSConnection";
import { JobStatus } from "./job-status";
import {
    AicsSuccessResponse,
    FSSRequestFile,
    FSSResponseFile,
    StartUploadResponse, UploadMetadata,
    UploadMetadataResponse
} from "./types";

const copyFile = promisify(fs.copyFile);

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
                    throw new Error("Start upload failed");
                }) as AicsSuccessResponse<StartUploadResponse>;
        const jsonData: StartUploadResponse[] = response.data;
        const { jobId, uploadDirectory } = jsonData[0];
        this.jobId = jobId;
        this.uploadDirectory = uploadDirectory;
        console.log(`Start Upload Success. JobId: ${jobId}. UploadDir: ${uploadDirectory}`);
    }

    /***
     * Add files to the upload job, along with their metadata.
     *
     * Return the number of files copied
     */
    public async copy(sourceFile: string, metadata: UploadMetadata): Promise<number> {
        // consistent between OS's
        const basename = path.posix.basename(sourceFile);

        // check that we have not already processed this file
        if (this.sourceFiles[basename]) {
            throw new Error(`File ${basename} already exists in this upload set!`);
        }

        const { fileType } = metadata;
        if (!fileType) {
            throw new Error(`Metadata for file ${sourceFile} must have fileType defined`);
        }

        const md5Hash = await this.copyWithChecksum(sourceFile, basename);
        this.sourceFiles[sourceFile] = { // todo using sourcefile instead of basename unlike python code
            fileName: basename,
            fileType,
            md5hex: md5Hash,
            metadata: {
                ...metadata,
                file: {
                    ...metadata.file,
                    fileName: basename,
                    originalPath: sourceFile,
                },
            },
        };

        console.log("in copy", this.sourceFiles);

        return 1; // todo: is this necessary
    }

    public async copyComplete(): Promise<JobStatus> {
        const request = {
            files: values(this.sourceFiles),
            jobId: this.jobId,
        };
        console.log("copyComplete", values(this.sourceFiles));
        const jsonData: AicsSuccessResponse<UploadMetadataResponse> =
            await this.fss.post("1.0/file/uploadComplete", request);
        console.log("Upload Complete");
        this.resultFiles = jsonData.data[0].files;
        return new JobStatus(this.fss, this.jobId);
    }

    private async copyWithChecksum(sourceFile: string, basename: string): Promise<string> {
        // source: https://blog.abelotech.com/posts/calculate-checksum-hash-nodejs-javascript/
        const hash = crypto.createHash("md5");
        let result = "";
        const stream = fs.createReadStream(sourceFile);
        stream.on("data", async (data: string) => {
            hash.update(data, "utf8");
        } );
        stream.on("end", () => result = hash.digest("hex"));
        await copyFile(sourceFile, `${this.uploadDirectory}/${basename}`);
        return result;
    }
}
