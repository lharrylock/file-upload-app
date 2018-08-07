import {
    Button,
    Icon,
} from "antd";
import * as classNames from "classnames";
import { remote } from "electron";
import * as React from "react";

import {
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
} from "../../state/selection/types";

const styles = require("./style.css");

export interface Props {
    className?: string;
    onDrop?: (files: FileList) => LoadFilesFromDragAndDropAction;
    onOpen?: (files: string[]) => LoadFilesFromOpenDialogAction;
}

export interface DragAndDropSquareState {
    isHovered: boolean;
}

class DragAndDropSquare extends React.Component<Props, DragAndDropSquareState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isHovered: false,
        };
        this.onDrop = this.onDrop.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onBrowse = this.onBrowse.bind(this);
    }

    public render(): React.ReactNode {
        const {
            className,
        } = this.props;

        return (
            <div
                className={classNames(styles.container, {[styles.highlight]: this.state.isHovered}, className)}
                onDragEnter={this.onDrag}
                onDragLeave={this.onDragLeave}
                onDragEnd={this.onDragLeave}
                onDrop={this.onDrop}
            >
                <Icon type="upload" className={styles.uploadIcon} />
                <div>Drag and Drop</div>
                <div>- or -</div>
                <Button type="primary" onClick={this.onBrowse}>Browse</Button>
            </div>
        );
    }

    private onBrowse(): void {
        // todo create a type for this
        const properties: Array<"openFile" | "openDirectory" | "multiSelections" | "showHiddenFiles" |
            "createDirectory" | "promptToCreate" | "noResolveAliases" | "treatPackageAsDirectory"> =
            ["openFile", "openDirectory", "multiSelections"];
        const options = {
            properties,
            title: "Upload files",
        };
        remote.dialog.showOpenDialog(options, (filenames: any) => {
            // tslint:disable-next-line
            console.log(filenames);
            // todo ugly
            if (this.props.onOpen) {
                this.props.onOpen(filenames);
            }
        });
    }

    private onDrag(): boolean {
        this.setState({isHovered: true});
        return false;
    }

    private onDragLeave(): boolean {
        this.setState({isHovered: false});
        return false;
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        // todo this is ugly
        if (this.props.onDrop) {
            this.props.onDrop(e.dataTransfer.files);
        }

        return false;
    }
}

export default DragAndDropSquare;
