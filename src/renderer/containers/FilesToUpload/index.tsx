import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import FileToUploadRow from "../../components/FileToUploadRow";

import {
    selection,
    State,
} from "../../state";
import { UploadFile } from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    files: UploadFile[];
}

class FilesToUpload extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {
            className,
            files,
        } = this.props;
        return (
            <div
                className={classNames(styles.container, className)}
            >
                {files.map((f) => (
                    <FileToUploadRow name={f.name} key={f.name}/>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        files: selection.selectors.getSelectedFiles(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(FilesToUpload);
