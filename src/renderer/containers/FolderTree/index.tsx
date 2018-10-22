import { Button, Tree } from "antd";
import Icon from "antd/es/icon";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { selection, State } from "../../state";
import { ClearStagedFilesAction, SelectFileAction, UploadFile } from "../../state/selection/types";
import { AppStatus } from "../../state/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    status?: AppStatus;
    files?: UploadFile[];
    onCheck?: (files: string[]) => SelectFileAction;
    onClear?: () => ClearStagedFilesAction;
}

const FOLDER_TAG = "(folder)";

class FolderTree extends React.Component<Props, {}> {
    public static renderChildDirectories(file: UploadFile): React.ReactNode {
        if (!file.isDirectory || !file.files) {
            return <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={true}/>;
        }

        return (
            <Tree.TreeNode title={file.name} key={file.fullPath + FOLDER_TAG} isLeaf={false}>
                {file.files.map((child: UploadFile) => FolderTree.renderChildDirectories(child))}
            </Tree.TreeNode>
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
        const filesExcludingFolders = files.filter((file: string) => !file.includes(FOLDER_TAG));
        if (this.props.onCheck) {
            this.props.onCheck(filesExcludingFolders);
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
            status,
        } = this.props;

        if (!files) {
            return null;
        }

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.logoContainer}>
                    <Icon type="cloud-upload" className={styles.logo}/>
                    <span className={styles.brandName}>AICS File Uploader</span>
                </div>
                <div className={styles.fileTree}>
                    <Button onClick={this.clearAll} icon="delete" shape="circle"/>
                    <Button icon="upload" shape="circle"/>
                    <Tree.DirectoryTree
                        checkable={false}
                        multiple={true}
                        defaultExpandAll={true}
                        onSelect={this.onSelect}
                        onExpand={this.onExpand}
                    >
                        {files.map((file: UploadFile) => FolderTree.renderChildDirectories(file))}
                    </Tree.DirectoryTree>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props): Partial<Props> {
    return {
        className: props.className,
        files: state.selection.stagedFiles,
        status: selection.selectors.getAppStatus(state),
    };
}

const dispatchToPropsMap: Partial<Props> = {
    onCheck: selection.actions.selectFile,
    onClear: selection.actions.clearStagedFiles,
};

export default connect(mapStateToProps, dispatchToPropsMap)(FolderTree);
