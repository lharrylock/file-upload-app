import { Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import {
    LoadFilesFromDragAndDropAction,
} from "../../state/selection/types";

const styles = require("./style.css");

export interface Props {
    className?: string;
    onDrop?: (file: FileList) => LoadFilesFromDragAndDropAction;
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
            </div>
        );
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
