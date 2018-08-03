import * as React from "react";

import FilesToUpload from "../FilesToUpload";
import FolderTree from "../FolderTree";

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
            </div>
        );
    }
}
