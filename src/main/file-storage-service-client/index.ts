import Logger from "js-logger";
import { ILogLevel } from "js-logger/src/types";
import { map, values } from "lodash";
import os from "os";

import { FSSConnection } from "./FSSConnection";
import {
    FSSResponseFile,
    UploadClient, UploadMetadata,
    UploadResponse,
    Uploads
} from "./types";
import { UploadJob } from "./upload-job";
import { Uploader } from "./uploader";

export default class FileStoreServiceClient implements UploadClient {
    private readonly fss: FSSConnection;
    private uploader: Uploader;

    constructor(host: string, port: string = "80", logLevel: ILogLevel = Logger.WARN, user?: string) {
        if (!host) {
            throw new Error("Host must be defined");
        }

        if (!user) {
            user = os.userInfo().username;
        }

        this.fss = new FSSConnection(host, port, user);
        this.uploader = new Uploader(this.fss);
        Logger.useDefaults();
        Logger.setLevel(logLevel);
    }

    public async uploadFiles(metadata: Uploads): Promise<UploadResponse> {
        Logger.info("Received uploadFiles request", metadata);
        this.uploader.checkDuplicates(metadata);

        const uploadJob: UploadJob = await this.uploader.startUpload();

        Logger.time(`Copying ${values(metadata).length} files`);
        await Promise.all(map(metadata, async (fileMetadata: UploadMetadata, file: string) =>
            uploadJob.copy(file, fileMetadata)
        ));
        Logger.time(`Copying ${values(metadata).length} files`);

        const uploadStatus = await uploadJob.copyComplete();
        await uploadStatus.waitForSuccess();
        return uploadJob.resultFiles.reduce((accum: {[id: string]: FSSResponseFile}, curr: FSSResponseFile) => ({
            ...accum,
            [curr.fileName]: curr,
        }), {});
    }
}
