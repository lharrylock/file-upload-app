import { Spin } from "antd";
import * as React from "react";
import { connect } from "react-redux";

import {
    isLoading,
    selection,
} from "../../state";
import { AppPage } from "../../state/selection/types";
import { State } from "../../state/types";

import DragAndDropSquare from "../DragAndDropSquare/index";

const styles = require("./styles.css");

interface AppProps {
    loading: boolean;
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
            loading,
            page,
        } = this.props;

        const showFolderTree = page !== AppPage.DragAndDrop;

        return (
            <div className={styles.container}>
                {showFolderTree &&
                    <div>
                        <div>Future Folder Tree</div>
                        {loading && <Spin size="large"/>}
                    </div>
                }
                {APP_PAGE_TO_CONTAINER_MAP.get(page)}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        loading: isLoading.selectors.getValue(state),
        page: selection.selectors.getAppPage(state),
    };
}

export default connect(mapStateToProps, {})(App);
