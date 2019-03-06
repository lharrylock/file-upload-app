import "aics-react-labkey/dist/styles.css";
import { message } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FolderTree from "../../components/FolderTree";
import { feedback, selection } from "../../state";
import { clearAlert } from "../../state/feedback/actions";
import { getAlert } from "../../state/feedback/selectors";
import { AlertType, AppAlert, ClearAlertAction } from "../../state/feedback/types";
import { requestMetadata } from "../../state/metadata/actions";
import { RequestMetadataAction } from "../../state/metadata/types";
import {
    AppPageConfig,
    GetFilesInFolderAction,
    Page,
    SelectFileAction,
    UploadFile,
} from "../../state/selection/types";
import { State } from "../../state/types";
import { FileTag } from "../../state/upload/types";
import AssociateWells from "../AssociateWells";

import DragAndDropSquare from "../DragAndDropSquare";
import EnterBarcode from "../EnterBarcode";

import "../../styles/fonts.css";
import { getFileToTags } from "./selectors";
const styles = require("./styles.css");
const ALERT_DURATION = 2;

interface AppProps {
    alert?: AppAlert;
    clearAlert: ActionCreator<ClearAlertAction>;
    fileToTags: Map<string, FileTag[]>;
    files: UploadFile[];
    getFilesInFolder: ActionCreator<GetFilesInFolderAction>;
    loading: boolean;
    requestMetadata: ActionCreator<RequestMetadataAction>;
    selectFile: ActionCreator<SelectFileAction>;
    selectedFiles: string[];
    page: Page;
}

export const APP_PAGE_TO_CONFIG_MAP = new Map<Page, AppPageConfig>([
    [Page.DragAndDrop, {
        container: <DragAndDropSquare key="dragAndDrop"/>,
        folderTreeSelectable: false,
        folderTreeVisible: false,
    }],
    [Page.EnterBarcode, {
        container:  <EnterBarcode key="enterBarcode" className={styles.mainContent}/>,
        folderTreeSelectable: false,
        folderTreeVisible: true,
    }],
    [Page.AssociateWells, {
        container:  <AssociateWells key="associateWells" className={styles.mainContent}/>,
        folderTreeSelectable: true,
        folderTreeVisible: true,
    }],
]);

message.config({
    maxCount: 1,
});

class App extends React.Component<AppProps, {}> {
    public componentDidMount() {
        this.props.requestMetadata();
    }

    public componentDidUpdate() {
        const { alert, clearAlert: dispatchClearAlert } = this.props;
        if (alert) {
            const { message: alertText, manualClear, type} = alert;
            const alertBody = <div>{alertText}</div>;
            const duration = manualClear ? 0 : ALERT_DURATION;

            switch (type) {
                case AlertType.WARN:
                    message.warn(alertBody, duration);
                    break;
                case AlertType.SUCCESS:
                    message.success(alertBody, duration);
                    break;
                case AlertType.ERROR:
                    message.error(alertBody, duration);
                    break;
                default:
                    message.info(alertBody, duration);
                    break;
            }

            dispatchClearAlert();
        }
    }

    public render() {
        const {
            fileToTags,
            files,
            getFilesInFolder,
            loading,
            selectFile,
            selectedFiles,
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
                       selectedKeys={selectedFiles}
                       fileToTags={fileToTags}
                   />
                }
                {pageConfig.container}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        alert: getAlert(state),
        fileToTags: getFileToTags(state),
        files: state.selection.stagedFiles,
        loading: feedback.selectors.getIsLoading(state),
        page: selection.selectors.getPage(state),
        selectedFiles: selection.selectors.getSelectedFiles(state),
    };
}

const dispatchToPropsMap = {
    clearAlert,
    getFilesInFolder: selection.actions.getFilesInFolder,
    requestMetadata,
    selectFile: selection.actions.selectFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
