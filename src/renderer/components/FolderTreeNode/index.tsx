import * as classNames from "classnames";
import * as React from "react";

import { File } from "../../state/selection/types";

const styles = require("./style.css");

export interface FolderTreeNodeProps {
    className?: string;
    file: File;
}

const FolderTreeNode: React.SFC<FolderTreeNodeProps> = (props) => {
    const {
        className,
        file,
    } = props;

    return (
        <div className={classNames(styles.container, className)}>
            {file.name}
        </div>
    );
};

export default FolderTreeNode;
