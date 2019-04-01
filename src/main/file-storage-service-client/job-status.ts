import { FSSConnection } from "./FSSConnection";

const DEFAULT_TIMEOUT = 30 * 60; // 30 minutes

interface Status { // todo fix this
    [id: string]: any;
}

export class JobStatus {
    private readonly fss: FSSConnection;
    private readonly jobId: string;

    constructor(fss: FSSConnection, jobId: string) {
        this.fss = fss;
        this.jobId = jobId;
    }

    public waitForSuccess(timeout: number = DEFAULT_TIMEOUT, interval: number = 5) {
        const status = this.waitForComplete(timeout, interval);
        if (!this.isSuccess(status)) {
            throw new Error(`Unable to upload job ${this.jobId}`);
        }

        return status;
    }

    public async waitForComplete(timeoutSeconds: number = DEFAULT_TIMEOUT, interval: number = 5): Promise<Status> {
        // todo type
        let status = await this.getStatus();
        const timeout = new Date();
        timeout.setSeconds(timeout.getSeconds() + timeoutSeconds);
        while (!this.isComplete(status) && (new Date()) < timeout) {
            setTimeout(() => status = this.getStatus(), interval);
        }
        return status;
    }

    public async getStatus(): Promise<Status> { // todo type
        const resp = await this.fss.get(`1.0/file/upload/${this.jobId}`);
        return resp.data[0].steps;
    }

    public isComplete(status?: Status): boolean {
        if (!status) {
            status = this.getStatus();
        }

        return this.isSuccess(status) || this.isFailure(status);
    }

    public isSuccess(status: Status): boolean {
        return true; // todo;
    }

    public isFailure(status: Status): boolean {
        return false; // todo
    }
}
