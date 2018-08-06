import * as classNames from "classnames";
import * as path from "path";
import * as React from "react";
import { connect } from "react-redux";

import DragAndDropSquare from "../../components/DragAndDropSquare";
import FolderTreeNode from "../../components/FolderTreeNode";
import {
    selection,
    State } from "../../state";
import {
    LoadFilesFromDragAndDropAction,
    UploadFile
} from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    files?: UploadFile[];
    onDrop?: (file: FileList) => LoadFilesFromDragAndDropAction;
}

class FolderTree extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {
            className,
            files,
            onDrop,
        } = this.props;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                {files && files.length > 0 ?
                    files.map((file: UploadFile) =>
                        (<FolderTreeNode key={path.resolve(file.path, file.name)} file={file}/>)
                    )
                    : <DragAndDropSquare onDrop={onDrop}/>}
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props) {
    return {
        className: props.className,
        files: state.selection.stagedFiles,
    };
}

const dispatchToPropsMap = {
    onDrop: selection.actions.loadFilesFromDragAndDrop,
};

export default connect(mapStateToProps, dispatchToPropsMap)(FolderTree);
