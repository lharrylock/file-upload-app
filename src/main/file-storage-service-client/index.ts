import { map } from "lodash";

import { FSSConnection } from "./FSSConnection";
import {
    FSSResponseFile,
    UploadClient,
    UploadResponse,
    Uploads
} from "./types";
import { UploadJob } from "./upload-job";
import { Uploader } from "./uploader";

export default class FileStoreServiceClient implements UploadClient {
    private readonly fss: FSSConnection;
    private uploader: Uploader;

    constructor(host: string, port: string = "80", user: string) { // todo figure out how to get user
        if (!host) {
            throw new Error("Host must be defined");
        }

        this.fss = new FSSConnection(host, port, user);
        this.uploader = new Uploader(this.fss);
    }

    public async uploadFiles(metadata: Uploads): Promise<UploadResponse> {
        this.uploader.checkDuplicates(metadata);

        const uploadJob: UploadJob = await this.uploader.startUpload();
        map(metadata, async (file: string, fileMetadata: any) => {
            await uploadJob.copy(file, fileMetadata);
        });

        const uploadStatus = await uploadJob.copyComplete();
        await uploadStatus.waitForSuccess();
        return uploadJob.resultFiles.reduce((accum: {[id: string]: FSSResponseFile}, curr: FSSResponseFile) => ({
            ...accum,
            [curr.fileName]: curr,
        }), {});
    }
}
