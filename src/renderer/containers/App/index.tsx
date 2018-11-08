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

const APP_PAGE_TO_CONTAINER_MAP = new Map<AppPage, JSX.Element>([
    [AppPage.DragAndDrop, <DragAndDropSquare key="dragAndDrop"/>],
    [AppPage.EnterBarcode, <div key="enterBarcode">TODO</div>],
]);

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
        this.state = {};
    }

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
                        {loading && <Spin size="large"/>}
                        Future Folder Tree
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
