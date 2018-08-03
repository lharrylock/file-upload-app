import * as classNames from "classnames";
import {
    readdirSync,
    statSync
} from "fs";
import { isEmpty } from "lodash";
import * as path from "path";
import * as React from "react";
import { connect } from "react-redux";

import FolderTreeNode from "../../components/FolderTreeNode";

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
                    files.map((file: File) =>
                        (<FolderTreeNode key={path.resolve(file.path, file.name)} file={file}/>)
                    )
                    : "drag content here"}
            </div>
        );
    }

    private onDrag(): boolean {
        return false;
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>): boolean {
        e.preventDefault();

        const files: File[] = [];

        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files.item(i);

            if (file) {
                files.push({
                    files: statSync(file.path).isDirectory() ? [] : null,
                    name: file.name,
                    path: file.path,
                });

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
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(FolderTree);
