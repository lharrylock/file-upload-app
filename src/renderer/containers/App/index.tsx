import "antd/dist/antd.css";
import * as React from "react";

import FilesToUpload from "../FilesToUpload";
import FolderTree from "../FolderTree";
import MetadataEntry from "../MetadataEntry/index";

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

    }

    public render() {
        return (
            <div className={styles.container}>
                <FolderTree className={styles.folderTree}/>
                <FilesToUpload className={styles.filesToUpload}/>
                <MetadataEntry className={styles.metadataEntry}/>
            </div>
        );
    }
}
