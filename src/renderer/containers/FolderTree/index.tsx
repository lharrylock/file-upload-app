import {
    Button,
    Tree
} from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import DragAndDropSquare from "../../components/DragAndDropSquare";
import {
    selection,
    State } from "../../state";
import {
    ClearStagedFilesAction,
    LoadFilesFromDragAndDropAction, LoadFilesFromOpenDialogAction,
    SelectFileAction,
    UploadFile
} from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    files?: UploadFile[];
    onCheck?: (files: string[]) => SelectFileAction;
    onClear?: () => ClearStagedFilesAction;
    onDrop?: (files: FileList) => LoadFilesFromDragAndDropAction; // todo these two are so similar
    onOpen?: (files: string[]) => LoadFilesFromOpenDialogAction;
}

const FOLDER_TAG = "(folder)";

class FolderTree extends React.Component<Props, {}> {
    public static renderChildDirectories(files: UploadFile[] | null): any {
        if (!files) {
            return null;
        }
        // tslint:disable-next-line
console.log(files);
        return (
            files.map((file: UploadFile) => {
                if (!file.isDirectory || !file.files) {
                    return <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={true}/>;
                }

                return (
                    <Tree.TreeNode title={file.name} key={file.fullPath + FOLDER_TAG} isLeaf={false}>
                        {FolderTree.renderChildDirectories(file.files)}
                    </Tree.TreeNode>
                );
            })
        );
    }

    constructor(props: Props) {
        super(props);
        this.clearAll = this.clearAll.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    public onSelect(files: string[]) {
        // todo ugly
        if (this.props.onCheck) {
            this.props.onCheck(files.filter((file: string) => !file.includes(FOLDER_TAG)));
        }
    }

    public onExpand(): void {
        // tslint:disable-next-line
        console.log('expand');
    }

    public clearAll(): void {
        // todo ugly
        if (this.props.onClear) {
            this.props.onClear();
        }
    }

    public render() {
        const {
            className,
            files,
            onDrop,
            onOpen,
        } = this.props;

        let body;
        if (!files || files.length === 0) {
            body = (
                <DragAndDropSquare
                    onDrop={onDrop}
                    onOpen={onOpen}
                />
            );
        } else {
            body = (
                <div>
                    <Button onClick={this.clearAll}>Clear all</Button>
                    <Tree.DirectoryTree
                        checkable={true}
                        multiple={true}
                        defaultExpandAll={true}
                        onCheck={this.onSelect}
                        onExpand={this.onExpand}
                    >
                        {files.map((file: UploadFile) => FolderTree.renderChildDirectories(file.files))}
                    </Tree.DirectoryTree>
                </div>
            );
        }

        return (
            <div className={classNames(className, styles.container)}>
                {body}
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props): Partial<Props> {
    return {
        className: props.className,
        files: state.selection.stagedFiles,
    };
}

const dispatchToPropsMap: Partial<Props> = {
    onCheck: selection.actions.selectFile,
    onClear: selection.actions.clearStagedFiles,
    onDrop: selection.actions.loadFilesFromDragAndDrop,
    onOpen: selection.actions.openFilesFromDialog,
};

export default connect(mapStateToProps, dispatchToPropsMap)(FolderTree);
