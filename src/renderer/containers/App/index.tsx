import "aics-react-labkey/dist/styles.css";
import * as React from "react";
import { connect } from "react-redux";

import FolderTree from "../../components/FolderTree";
import { isLoading, selection } from "../../state";
import { requestMetadata } from "../../state/metadata/actions";
import { RequestMetadataAction } from "../../state/metadata/types";
import {
    AppPage,
    AppPageConfig,
    GetFilesInFolderAction,
    SelectFileAction,
    UploadFile,
} from "../../state/selection/types";
import { State } from "../../state/types";

import DragAndDropSquare from "../DragAndDropSquare";
import EnterBarcode from "../EnterBarcode";

import "../../styles/fonts.css";
const styles = require("./styles.css");

interface AppProps {
    files: UploadFile[];
    getFilesInFolder: (folderToExpand: UploadFile) => GetFilesInFolderAction;
    loading: boolean;
    requestMetadata: () => RequestMetadataAction;
    selectFile: (files: string[]) => SelectFileAction;
    page: AppPage;
}

const APP_PAGE_TO_CONFIG_MAP = new Map<AppPage, AppPageConfig>([
    [AppPage.DragAndDrop, {
        container: <DragAndDropSquare key="dragAndDrop"/>,
        folderTreeSelectable: false,
        folderTreeVisible: false,
    }],
    [AppPage.EnterBarcode, {
        container:  <EnterBarcode key="enterBarcode" className={styles.mainContent}/>,
        folderTreeSelectable: false,
        folderTreeVisible: true,
    }],
    [AppPage.AssociateWells, {
        container:  <div key="plateMetadataEntry" className={styles.mainContent}>TODO</div>,
        folderTreeSelectable: true,
        folderTreeVisible: true,
    }],
]);

class App extends React.Component<AppProps, {}> {
    public componentDidMount() {
        this.props.requestMetadata();
    }

    public render() {
        const {
            files,
            getFilesInFolder,
            loading,
            selectFile,
            page,
        } = this.props;

        const pageConfig = APP_PAGE_TO_CONFIG_MAP.get(page);

        if (!pageConfig) {
            return null;
        }

        return (
            <div className={styles.container}>
                {pageConfig.folderTreeVisible &&
                   <FolderTree
                       className={styles.folderTree}
                       files={files}
                       getFilesInFolder={getFilesInFolder}
                       isLoading={loading}
                       isSelectable={pageConfig.folderTreeSelectable}
                       onCheck={selectFile}
                   />
                }
                {pageConfig.container}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        files: state.selection.stagedFiles,
        loading: isLoading.selectors.getValue(state),
        page: selection.selectors.getAppPage(state),
    };
}

const dispatchToPropsMap = {
    getFilesInFolder: selection.actions.getFilesInFolder,
    requestMetadata,
    selectFile: selection.actions.selectFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
