import * as classNames from "classnames";
import {
    readdirSync,
    statSync
} from "fs";
import {
    isEmpty,
    noop,
} from "lodash";
import * as path from "path";
import * as React from "react";

import { UploadFile } from "../../state/selection/types";

const styles = require("./style.css");

export interface Props {
    className?: string;
    file: UploadFile;
}

export interface FolderTreeNodeState {
    showChildren: boolean;
    children: UploadFile[];
}

class FolderTreeNode extends React.Component<Props, FolderTreeNodeState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            children: [],
            showChildren: false,
        };
        this.getOnNodeClick = this.getOnNodeClick.bind(this);
        this.getFilesFromDirectory = this.getFilesFromDirectory.bind(this);
    }

    public render(): React.ReactNode {
        const {
            className,
            file,
        } = this.props;

        const {
            children,
            showChildren,
        } = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <div onClick={this.getOnNodeClick(file)}>
                    {file.name} {file.files && "directory"}
                </div>

                {showChildren && children.map((childFile: UploadFile) =>
                    <FolderTreeNode key={childFile.name} file={childFile}/>) }
            </div>
        );
    }

    private getFilesFromDirectory(filePath: string): void {
        if (isEmpty(this.state.children)) {
            // tslint:disable-next-line
            console.log(filePath)
            const files: string[] = readdirSync(filePath);
            // tslint:disable-next-line
            console.log(files)
            const children: UploadFile[] = files.map((fileName: string) => ({
                files: statSync(path.resolve(filePath, fileName)).isDirectory() ? [] : null,
                name: fileName,
                path: filePath,
            }));
            this.setState({
                children,
                showChildren: !this.state.showChildren,
            });
        }
    }

    private getOnNodeClick(file: UploadFile): ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined {
        if (file.files) {
            return (e: React.MouseEvent<HTMLDivElement>) =>
                this.getFilesFromDirectory(file.path);
        }

        return undefined;
    }
}

export default FolderTreeNode;
