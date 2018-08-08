import "antd/dist/antd.css";
import * as React from "react";
import { connect } from "react-redux";

import DragAndDropSquare from "../../components/DragAndDropSquare/index";
import { selection } from "../../state";
import { LoadFilesFromDragAndDropAction, LoadFilesFromOpenDialogAction } from "../../state/selection/types";
import { AppStatus, State } from "../../state/types";

import FolderTree from "../FolderTree";
import MetadataDocuments from "../MetadataDocuments";
import MetadataEntry from "../MetadataEntry";

const styles = require("./style.css");

interface AppProps {
    onDrop?: (files: FileList) => LoadFilesFromDragAndDropAction; // todo these two are so similar
    onOpen?: (files: string[]) => LoadFilesFromOpenDialogAction;
    status: AppStatus;
}

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public getBody() {
        const {
            onDrop,
            onOpen,
            status,
        } = this.props;

        switch (status) {
            case AppStatus.CreatingMetadata:
                return (
                    <React.Fragment>
                        <FolderTree className={styles.folderTree}/>
                        <MetadataEntry className={styles.metadataEntry}/>
                    </React.Fragment>)
                ;
            case AppStatus.ViewingAllMetadata:
                return (
                    <React.Fragment>
                        <FolderTree className={styles.folderTree}/>
                        <MetadataDocuments className={styles.metadataEntry}/>
                    </React.Fragment>
                );
            default:
                return (
                    <DragAndDropSquare
                        onDrop={onDrop}
                        onOpen={onOpen}
                    />
                );
        }
    }

    public render() {
        const body = this.getBody();

        return (
            <div className={styles.container}>
                {body}
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<AppProps> {
    return {
        status: selection.selectors.getAppStatus(state),
    };
}

const dispatchToPropsMap: Partial<AppProps> = {
    onDrop: selection.actions.loadFilesFromDragAndDrop,
    onOpen: selection.actions.openFilesFromDialog,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
