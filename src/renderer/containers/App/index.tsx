import * as React from "react";
import { connect } from "react-redux";

import FolderTree from "../../components/FolderTree";
import {
    isLoading,
    selection,
} from "../../state";
import {
    AppPage,
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
    onCheck?: (files: string[]) => SelectFileAction;
    page: AppPage;
}

// This map will be used to determine which React Container to display
// based on the selected page stored in the app store
const APP_PAGE_TO_CONTAINER_MAP = new Map<AppPage, JSX.Element>([
    [AppPage.DragAndDrop, <DragAndDropSquare key="dragAndDrop"/>],
    [AppPage.EnterBarcode, <div key="enterBarcode">TODO</div>],
]);

class App extends React.Component<AppProps, {}> {
    public render() {
        const {
            files,
            getFilesInFolder,
            loading,
            onCheck,
            page,
        } = this.props;

        const showFolderTree = page !== AppPage.DragAndDrop;

        return (
            <div className={styles.container}>
                {showFolderTree &&
                   <FolderTree
                       className={styles.folderTree}
                       files={files}
                       getFilesInFolder={getFilesInFolder}
                       isLoading={loading}
                       onCheck={onCheck}
                   />
                }
                {APP_PAGE_TO_CONTAINER_MAP.get(page)}
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
    onCheck: selection.actions.selectFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
