import { Icon, Spin, Tree } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import {
    GetFilesInFolderAction,
    SelectFileAction,
    UploadFile,
} from "../../state/selection/types";

const styles = require("./style.css");

interface FolderTreeProps {
    className?: string;
    files: UploadFile[];
    getFilesInFolder: (folderToExpand: UploadFile) => GetFilesInFolderAction;
    isLoading?: boolean;
    onCheck?: (files: string[]) => SelectFileAction;
}

interface FolderTreeState {
    expandedFolders: Set<string>;
}

// todo figure out if this is necessary
const FOLDER_TAG = "(folder)";

class FolderTree extends React.Component<FolderTreeProps, FolderTreeState> {
    constructor(props: FolderTreeProps) {
        super(props);
        this.state = {
            expandedFolders: new Set<string>(),
        };

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

    public onExpand(expandedKeys: string[]): void {
        // find UploadFile to send
        expandedKeys.forEach((key) => {
            if (!this.state.expandedFolders.has(key)) {
                this.setState({expandedFolders: this.state.expandedFolders.add(key)});
                const folderToUpdate = this.getMatchingFileFromPath(this.props.files, key.slice(0, -FOLDER_TAG.length));

                if (folderToUpdate) {
                    this.props.getFilesInFolder(folderToUpdate);
                }
            }
        });
    }

    public getMatchingFileFromPath(files: UploadFile[], path: string): UploadFile | null {
        for (const file of files) {
            if (file.getIsDirectory()) {
                if (file.fullPath === path) {
                    return file;
                } else if (path.indexOf(file.fullPath) === 0) {
                    return this.getMatchingFileFromPath(file.files, path);
                }
            }
        }

        return null;
    }

    public renderChildDirectories(file: UploadFile): React.ReactNode {
        if (!file.getIsDirectory() || !file.files) {
            return <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={true}/>;
        }

        return (
            <Tree.TreeNode title={file.name} key={file.fullPath + FOLDER_TAG} isLeaf={false}>
                {file.files.map((child: UploadFile) => this.renderChildDirectories(child))}
            </Tree.TreeNode>
        );
    }

    public render() {
        const {
            className,
            files,
            isLoading,
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
                    {!isLoading && <Tree.DirectoryTree
                        checkable={false}
                        multiple={true}
                        defaultExpandAll={false}
                        onSelect={this.onSelect}
                        onExpand={this.onExpand}
                    >
                        {files.map((file: UploadFile) => this.renderChildDirectories(file))}
                    </Tree.DirectoryTree>}
                    {isLoading && <Spin size="large"/>}
                </div>
            </div>
        );
    }
}

export default FolderTree;
