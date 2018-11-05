import "antd/dist/antd.css";
import * as React from "react";
import { connect } from "react-redux";

import { selection } from "../../state";

import { AppPage } from "../../state/selection/types";

import { State } from "../../state/types";

import DragAndDropSquare from "../DragAndDropSquare/index";

const styles = require("./style.css");

interface AppProps {
    page?: AppPage;
}

const APP_PAGE_TO_CONTAINER_MAP = new Map([
    [AppPage.DragAndDrop, <DragAndDropSquare key="dragAndDrop"/>],
    [AppPage.EnterBarcode, <div key="enterBarcode">TODO</div>],
]);

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { page } = this.props;

        return APP_PAGE_TO_CONTAINER_MAP.get(page || AppPage.DragAndDrop);
    }
}

function mapStateToProps(state: State) {
    return {
        status: selection.selectors.getAppStatus(state),
    };
}

export default connect(mapStateToProps, {})(App);
