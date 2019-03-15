import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../state/types";

const styles = require("./style.pcss");

interface Props {
    className?: string;
}

class UploadJobs extends React.Component<Props, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const {className} = this.props;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                Hello from UploadJobs container
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {

    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(UploadJobs);
