import * as React from "react";
import { connect } from "react-redux";

import FolderTree from "../../components/FolderTree";
import { isLoading, selection } from "../../state";
import {
    AppPage,
    AppPageConfig,
    GetFilesInFolderAction,
    SelectFileAction,
    UploadFile,
} from "../../state/selection/types";
import { State } from "../../state/types";

import DragAndDropSquare from "../DragAndDropSquare";

const styles = require("./styles.css");

interface AppProps {
    files: UploadFile[];
    getFilesInFolder: (folderToExpand: UploadFile) => GetFilesInFolderAction;
    loading: boolean;
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
        container:  <div key="enterBarcode">TODO</div>,
        folderTreeSelectable: false,
        folderTreeVisible: true,
    }],
]);

class App extends React.Component<AppProps, {}> {
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
    selectFile: selection.actions.selectFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
