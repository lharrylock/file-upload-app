import { Tree } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import DragAndDropSquare from "../../components/DragAndDropSquare";
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
    public static renderChildDirectories(files: UploadFile[] | null): any {
        if (!files) {
            return null;
        }

        return (
            files.map((file: UploadFile) => {
                if (!file.isDirectory || !file.files) {
                    return <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={true}/>;
                }

                return (
                    <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={false}>
                        {FolderTree.renderChildDirectories(file.files)}
                    </Tree.TreeNode>
                );
            })
        );
    }

    constructor(props: Props) {
        super(props);
        this.onExpand = this.onExpand.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    public onSelect() {
        // tslint:disable-next-line
        console.log('select');
    }

    public onExpand(): void {
        // tslint:disable-next-line
        console.log('expand');
    }

    public render() {
        const {
            className,
            files,
            onDrop,
        } = this.props;

        if (!files || files.length === 0) {
            return (
                <DragAndDropSquare
                    className={classNames(className, styles.container)}
                    onDrop={onDrop}
                />
            );
        }

        return (
            <Tree.DirectoryTree
                className={classNames(className, styles.container)}
                multiple={true}
                defaultExpandAll={true}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
            >
                {files.map((file: UploadFile) => FolderTree.renderChildDirectories(file.files))}
            </Tree.DirectoryTree>
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
