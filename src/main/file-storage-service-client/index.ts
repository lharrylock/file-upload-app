import { map } from "lodash";
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

    constructor(host: string, port: string = "80", user?: string) {
        if (!host) {
            throw new Error("Host must be defined");
        }

        if (!user) {
            user = os.userInfo().username;
            console.log(user);
        }

        this.fss = new FSSConnection(host, port, user);
        this.uploader = new Uploader(this.fss);
    }

    public async uploadFiles(metadata: Uploads): Promise<UploadResponse> {
        console.log(metadata);
        this.uploader.checkDuplicates(metadata);

        const uploadJob: UploadJob = await this.uploader.startUpload();

        await Promise.all(map(metadata, async (fileMetadata: UploadMetadata, file: string) =>
            uploadJob.copy(file, fileMetadata)
        ));

        const uploadStatus = await uploadJob.copyComplete();
        await uploadStatus.waitForSuccess();
        return uploadJob.resultFiles.reduce((accum: {[id: string]: FSSResponseFile}, curr: FSSResponseFile) => ({
            ...accum,
            [curr.fileName]: curr,
        }), {});
    }
}
