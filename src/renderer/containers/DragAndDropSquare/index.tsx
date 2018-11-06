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
import { LoadFilesFromDragAndDropAction, LoadFilesFromOpenDialogAction } from "../../state/selection/types";
import { State } from "../../state/types";

const styles = require("./style.css");

interface DragAndDropSquareProps {
    className?: string;
    onDrop: (files: FileList) => LoadFilesFromDragAndDropAction;
    onOpen: (files: string[]) => LoadFilesFromOpenDialogAction;
}

interface DragAndDropSquareState {
    // todo better name and comment explaining what it's for
    count: number;
    isHovered: boolean;
}

class DragAndDropSquare extends React.Component<DragAndDropSquareProps, DragAndDropSquareState> {
    constructor(props: DragAndDropSquareProps) {
        super(props);
        this.state = {
            count: 0,
            isHovered: false,
        };
        this.onDrop = this.onDrop.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onBrowse = this.onBrowse.bind(this);
    }

    public render() {
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
                <div className={styles.content}>
                    <Icon type="upload" className={styles.uploadIcon} />
                    <div>Drag and Drop</div>
                    <div>- or -</div>
                    <Button type="primary" onClick={this.onBrowse} className={styles.button}>Browse</Button>
                </div>
            </div>
        );
    }

    private onBrowse(): void {
        const options: OpenDialogOptions = {
            properties: ["openFile", "openDirectory", "multiSelections"],
            title: "Upload files",
        };
        remote.dialog.showOpenDialog(options, (filenames: any) => {
            // tslint:disable-next-line
            console.log(filenames);
            // todo ugly
            if (this.props.onOpen && !isEmpty(filenames)) {
                this.props.onOpen(filenames);
            }
        });
    }

    private onDrag(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        this.setState({isHovered: true, count: this.state.count + 1});
    }

    private onDragLeave(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();

        const count = this.state.count - 1;
        if (count === 0) {
            this.setState({isHovered: false, count: 0});
        } else {
            this.setState({count});
        }
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();
        this.setState({isHovered: false});
        // todo this is ugly
        if (this.props.onDrop) {
            this.props.onDrop(e.dataTransfer.files);
        }

        return false;
    }
}

function mapStateToProps(state: State) {
    return {

    };
}

const dispatchToPropsMap = {
    onDrop: selection.actions.loadFilesFromDragAndDrop,
    onOpen: selection.actions.openFilesFromDialog,
};
export default connect(mapStateToProps, dispatchToPropsMap)(DragAndDropSquare);
