import { ipcRenderer } from "electron";
import {
    readdirSync,
    statSync,
} from "fs";
import { isEmpty } from "lodash";
import * as React from "react";

const styles = require("./style.css");

interface AppState {
    files?: File[];
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            files: [],
        };
        this.onDrop = this.onDrop.bind(this);
    }

    public onDrag(): boolean {
        return false;
    }

    public onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        const files: File[] = [];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files.item(i);

            if (file) {

                if (statSync(file.path).isDirectory()) {
                    // tslint:disable-next-line
                    readdirSync(file.path).forEach((f) => console.log(f));
                } else {
                    files.push(file);
                }

                // ipcRenderer.send("filereceived", file.path);

            } else {
                // display error?
            }
        }

        if (!isEmpty(files)) {
            this.setState({files});
        }

        return false;
    }

    public render() {
        const { files } = this.state;
        return (
            <div
                className={styles.container}
                onDragOver={this.onDrag}
                onDragLeave={this.onDrag}
                onDragEnd={this.onDrag}
                onDrop={this.onDrop}
            >
                test
                {files && files.length > 0 ? files.map((f) => <div key={f.path}>{f.path}</div>) : "Drag Something Here"}
            </div>
        );
    }
}
