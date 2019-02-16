import "aics-react-labkey/dist/styles.css";
import { message } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, AnyAction } from "redux";

import AlertBody from "../../components/AlertBody";
import FolderTree from "../../components/FolderTree";
import { feedback, selection } from "../../state";
import { clearAlert } from "../../state/feedback/actions";
import { getAlert } from "../../state/feedback/selectors";
import { AlertType, AppAlert } from "../../state/feedback/types";
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
    alert?: AppAlert;
    dispatch: ActionCreator<AnyAction>;
    files: UploadFile[];
    getFilesInFolder: ActionCreator<GetFilesInFolderAction>;
    loading: boolean;
    requestMetadata: ActionCreator<RequestMetadataAction>;
    selectFile: ActionCreator<SelectFileAction>;
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

message.config({
    maxCount: 1,
});

class App extends React.Component<AppProps, {}> {
    public componentDidMount() {
        this.props.requestMetadata();
    }

    public componentDidUpdate() {
        const { alert, dispatch } = this.props;
        if (alert) {
            const { message: alertText, type, onNo, onYes} = alert;
            const alertBody = (
                <AlertBody
                    message={alertText}
                    onNo={onNo ? this.dismissAlert : undefined}
                    onYes={onYes ? this.acceptAlert : undefined}
                />
            );

            const dispatchClearAlert = () => dispatch(clearAlert());
            switch (type) {
                case AlertType.WARN:
                    message.warn(alertBody, 0, dispatchClearAlert);
                    break;
                case AlertType.SUCCESS:
                    message.success(alertBody, 2);
                    dispatchClearAlert();
                    break;
                case AlertType.ERROR:
                    message.error(alertBody, 2);
                    dispatchClearAlert();
                    break;
                default:
                    message.info(alertBody, 5);
                    dispatchClearAlert();
                    break;
            }
        }
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

    private dismissAlert = (): void => {
        const { alert, dispatch } = this.props;
        if (alert && alert.onNo) {
            dispatch(alert.onNo);
        }
    }

    private acceptAlert = () => {
        const { alert, dispatch } = this.props;
        if (alert && alert.onYes) {
            dispatch(alert.onYes);
        }
    }

}

function mapStateToProps(state: State) {
    return {
        alert: getAlert(state),
        files: state.selection.stagedFiles,
        loading: feedback.selectors.getIsLoading(state),
        page: selection.selectors.getAppPage(state),
    };
}

const dispatchToPropsMap = {
    dispatch: (action: AnyAction) => action,
    getFilesInFolder: selection.actions.getFilesInFolder,
    requestMetadata,
    selectFile: selection.actions.selectFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
