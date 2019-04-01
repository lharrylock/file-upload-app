import axios, { AxiosResponse } from "axios";
import { AxiosRequestConfig } from "axios";
import applyConverters from "axios-case-converter";
import { AicsSuccessResponse } from "./types";

interface HeaderMap {
    [key: string]: string;
}

const DEFAULT_TIMEOUT = 1000000; // todo

export class FSSConnection {
    private readonly host: string;
    private readonly port: string;
    private readonly user: string;
    private axiosClient: any;

    constructor(host: string, port: string = "80", user: string) {
        this.host = host;
        this.port = port;
        this.user = this.ensureUser(user);
        this.axiosClient = applyConverters(axios.create());
    }

    public post(path: string, body: any, headers: HeaderMap = {}, timeout: number = DEFAULT_TIMEOUT):
        Promise<AicsSuccessResponse<any>> {
        const url = this.getUrl(path);
        return this.axiosClient.post(url, body, this.getAxiosConfig(headers, timeout))
            .then((resp: AxiosResponse) => resp.data);
    }

    public get(path: string, headers: HeaderMap = {}, timeout: number = DEFAULT_TIMEOUT):
        Promise<AicsSuccessResponse<any>> {
        const url = this.getUrl(path);
        return this.axiosClient.get(url, this.getAxiosConfig(headers, timeout))
            .then((resp: AxiosResponse) => resp.data);
    }

    private ensureUser(user: string): string {
        if (!user) {
            throw new Error("User is required!");
        }

        return user;
    }

    private getAxiosConfig(headers: HeaderMap = {}, timeout: number): AxiosRequestConfig {
        return {
            headers: this.getHeaders(headers),
            timeout,
        };
    }

    private getHeaders(extraHeaders: HeaderMap): HeaderMap {
        return {
            "Content-Type": "application/json",
            "X-User-Id": this.user,
            ...extraHeaders,
        };
    }

    private getUrl(path: string): string {
        return `http://${this.host}:${this.port}/fss/${path}`;
    }
}
