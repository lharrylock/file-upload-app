import { FSSConnection } from "./FSSConnection";
import {
    Uploads
} from "./types";
import { UploadJob } from "./upload-job";

export class Uploader {
    private readonly fss: FSSConnection;

    constructor(fss: FSSConnection) {
        this.fss = fss;
    }

    public checkDuplicates(metadata: Uploads): void {
        // todo implement
    }

    public async startUpload(): Promise<UploadJob> {
        const uploadJob = new UploadJob(this.fss);
        await uploadJob.startUpload();
        return uploadJob;
    }
}
