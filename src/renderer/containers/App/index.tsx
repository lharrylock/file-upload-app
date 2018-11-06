import "antd/dist/antd.css";
import { ipcRenderer } from "electron";

import * as React from "react";

const styles = require("./style.css");

interface AppState {
    file?: string;
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {};
        this.onDrop = this.onDrop.bind(this);
    }

    public onDrag(): boolean {
        return false;
    }

    public onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        this.setState({file: "File: Something"});
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files.item(i);

            if (file) {
                // tslint:disable-next-line
                console.log("File(s) you dragged here: ", file.path);
                ipcRenderer.send("filereceived", file.path);
            } else {
                // display error?
            }

        }

        return false;
    }

    public render() {
        const { file } = this.state;
        return (
            <div
                className={styles.container}
                onDragOver={this.onDrag}
                onDragLeave={this.onDrag}
                onDragEnd={this.onDrag}
                onDrop={this.onDrop}
            >
                {file || "Drag Something Here"}
            </div>
        );
    }
}
