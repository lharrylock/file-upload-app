import * as classNames from "classnames";
import {
    readdirSync,
    statSync
} from "fs";
import { isEmpty } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import FolderTreeNode from "../../components/FolderTreeNode/index";

import {
    //  selections,
    State,
} from "../../state";
import { File } from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
}

interface FolderTreeState {
    files?: File[];
}

class FolderTree extends React.Component<Props, FolderTreeState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            files: [],
        };
        this.onDrop = this.onDrop.bind(this);
        this.getFilesFromDirectory = this.getFilesFromDirectory.bind(this);
    }

    public render() {
        const { className } = this.props;
        const { files } = this.state;
        return (
            <div
                className={classNames(className, styles.container)}
                onDragOver={this.onDrag}
                onDragLeave={this.onDrag}
                onDragEnd={this.onDrag}
                onDrop={this.onDrop}
            >
                {files && files.length > 0 ?
                    files.map((file: File) => (<FolderTreeNode file={file}/>))
                    : "drag content here"}
            </div>
        );
    }

    private onDrag(): boolean {
        return false;
    }

    private getFilesFromDirectory(path: string): File[] {
        const files: string[] = readdirSync(path);
        // tslint:disable-next-line
        console.log(files)
        return files.map((f: string) => ({
            files: statSync(f).isDirectory() ? this.getFilesFromDirectory(f) : null,
            name: f,
        }));
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        const files: File[] = [];

        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files.item(i);

            if (file) {

                if (statSync(file.path).isDirectory()) {
                    files.push({
                        files: this.getFilesFromDirectory(file.path),
                        name: file.name,
                    });
                } else {
                    files.push({
                        files: null,
                        name: file.name,
                    });
                }

            } else {
                // display error?
            }
        }

        if (!isEmpty(files)) {
            this.setState({files});
        }

        return false;
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        // filteredOutMesoStructures: selections.selectors.getFilteredOutMesoStructures(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(FolderTree);
