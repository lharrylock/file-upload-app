import "antd/dist/antd.css";
import * as React from "react";
import { connect } from "react-redux";

import { selection } from "../../state";
import { State } from "../../state/types";

import FilesToUpload from "../FilesToUpload";
import FolderTree from "../FolderTree";
import MetadataEntry from "../MetadataEntry/index";

const styles = require("./style.css");

interface AppProps {
    hasStagedFiles: boolean;
}

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render() {
        const { hasStagedFiles } = this.props;
        return (
            <div className={styles.container}>
                <FolderTree className={styles.folderTree}/>
                {hasStagedFiles && <FilesToUpload className={styles.filesToUpload}/>}
                {hasStagedFiles && <MetadataEntry className={styles.metadataEntry}/>}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        hasStagedFiles: selection.selectors.hasStagedFiles(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
