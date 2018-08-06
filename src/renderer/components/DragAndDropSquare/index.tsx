import * as classNames from "classnames";
import {
    statSync
} from "fs";
import {
    isEmpty
} from "lodash";
import * as React from "react";

import {
    LoadFilesFromDragAndDropAction,
} from "../../state/selection/types";

const styles = require("./style.css");

export interface Props {
    className?: string;
    onDrop?: (file: FileList) => LoadFilesFromDragAndDropAction;
}

class DragAndDropSquare extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }

    public render(): React.ReactNode {
        const {
            className,
        } = this.props;

        return (
            <div
                className={classNames(styles.container, className)}
                onDragOver={this.onDrag}
                onDragLeave={this.onDrag}
                onDragEnd={this.onDrag}
                onDrop={this.onDrop}
            >
                Drag and Drop Files here
            </div>
        );
    }

    private onDrag(): boolean {
        return false;
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        // todo this is ugly
        if (this.props.onDrop) {
            // tslint:disable-next-line
            console.log('received files');
            this.props.onDrop(e.dataTransfer.files);
        }

        return false;
    }
}

export default DragAndDropSquare;
