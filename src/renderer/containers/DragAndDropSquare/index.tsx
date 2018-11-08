import {
    Button,
    Icon,
} from "antd";
import * as classNames from "classnames";
import {
    OpenDialogOptions,
    remote,
} from "electron";
import { isEmpty } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import { selection } from "../../state";
import {
    AppPage,
    LoadFilesFromDragAndDropAction,
    LoadFilesFromOpenDialogAction,
    SelectPageAction,
} from "../../state/selection/types";

const styles = require("./style.css");

interface DragAndDropSquareProps {
    className?: string;
    onDrop: (files: FileList) => LoadFilesFromDragAndDropAction;
    onOpen: (files: string[]) => LoadFilesFromOpenDialogAction;
}

interface DragAndDropSquareState {
    // Keeps track of net number of drag events into component.
    // Used to determine if the element is being hovered or not.
    // It is necessary because the child elements also will fire this event so we
    // need to keep track of how many children we enter and leave.
    dragEnterCount: number;
}

class DragAndDropSquare extends React.Component<DragAndDropSquareProps, DragAndDropSquareState> {
    constructor(props: DragAndDropSquareProps) {
        super(props);
        this.state = {
            dragEnterCount: 0,
        };
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onBrowse = this.onBrowse.bind(this);
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div
                className={classNames(styles.container, {[styles.highlight]: this.isHovered}, className)}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragEnd={this.onDragLeave}
                onDrop={this.onDrop}
            >
                <div className={styles.content}>
                    <Icon type="upload" className={styles.uploadIcon} />
                    <div>Drag and Drop</div>
                    <div>- or -</div>
                    <Button type="primary" onClick={this.onBrowse} className={styles.button}>Browse</Button>
                </div>
            </div>
        );
    }

    // Opens native file explorer
    private onBrowse(): void {
        const options: OpenDialogOptions = {
            properties: ["openFile", "openDirectory", "multiSelections"],
            title: "Open files",
        };

        remote.dialog.showOpenDialog(options, (filenames: string[]) => {
            // If cancel is clicked, this callback gets called and filenames is undefined
            if (!isEmpty(filenames)) {
                this.props.onOpen(filenames);
            }
        });
    }

    private onDragEnter(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        this.setState({dragEnterCount: this.state.dragEnterCount + 1});
    }

    private onDragLeave(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        this.setState({dragEnterCount: this.state.dragEnterCount - 1});
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        this.setState({dragEnterCount: 0});
        this.props.onDrop(e.dataTransfer.files);
    }

    get isHovered(): boolean {
        return this.state.dragEnterCount > 0;
    }
}

const mapStateToProps = () => ({});

const dispatchToPropsMap = {
    onDrop: selection.actions.loadFilesFromDragAndDrop,
    onOpen: selection.actions.openFilesFromDialog,
};
export default connect(mapStateToProps, dispatchToPropsMap)(DragAndDropSquare);
