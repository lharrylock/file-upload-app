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
    isSelectable: boolean;
    onCheck: (files: string[]) => SelectFileAction;
}

interface FolderTreeState {
    // Used to prevent requesting child files/folders more than once
    expandedFolders: Set<string>;
}

// Added to the keys used for Tree.TreeNode in order to quickly identify folders from files.
const FOLDER_TAG = "(folder)";

class FolderTree extends React.Component<FolderTreeProps, FolderTreeState> {
    // Recursively searches files and the child files for the first file whose full path is equivalent to path
    private static getMatchingFileFromPath(files: UploadFile[], path: string): UploadFile | null {
        for (const file of files) {
            if (file.getIsDirectory()) {
                if (file.fullPath === path) {
                    return file;
                } else if (path.indexOf(file.fullPath) === 0) {
                    return FolderTree.getMatchingFileFromPath(file.files, path);
                }
            }
        }

        return null;
    }

    constructor(props: FolderTreeProps) {
        super(props);
        this.state = {
            expandedFolders: new Set<string>(),
        };

        this.onExpand = this.onExpand.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    public render() {
        const {
            className,
            files,
            isLoading,
            isSelectable,
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
                        selectable={isSelectable}
                    >
                        {files.map((file: UploadFile) => this.renderChildDirectories(file))}
                    </Tree.DirectoryTree>}
                    {isLoading && <Spin size="large"/>}
                </div>
            </div>
        );
    }

    private onSelect(files: string[]) {
        const filesExcludingFolders = files.filter((file: string) => !file.includes(FOLDER_TAG));
        this.props.onCheck(filesExcludingFolders);
    }

    private onExpand(expandedKeys: string[]): void {
        // find UploadFile to send
        expandedKeys.forEach((key) => {
            // prevents us from requesting child files/directories more than once
            if (!this.state.expandedFolders.has(key)) {
                this.setState({expandedFolders: this.state.expandedFolders.add(key)});
                const filePath: string = key.slice(0, -FOLDER_TAG.length);
                const folderToUpdate = FolderTree.getMatchingFileFromPath(this.props.files, filePath);

                if (folderToUpdate) {
                    this.props.getFilesInFolder(folderToUpdate);
                }
            }
        });
    }

    private renderChildDirectories(file: UploadFile): React.ReactNode {
        if (!file.getIsDirectory()) {
            return <Tree.TreeNode title={file.name} key={file.fullPath} isLeaf={true}/>;
        }

        return (
            <Tree.TreeNode title={file.name} key={file.fullPath + FOLDER_TAG} isLeaf={false}>
                {file.files.map((child: UploadFile) => this.renderChildDirectories(child))}
            </Tree.TreeNode>
        );
    }
}

export default FolderTree;
