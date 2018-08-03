import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

export interface FileToUploadRowProps {
    className?: string;
    name: string;
}

const FileToUploadRow: React.SFC<FileToUploadRowProps> = (props) => {
    const {
        className,
        name,
    } = props;

    return (
        <div className={classNames(styles.container, className)}>
            {name}
        </div>
    );
};

export default FileToUploadRow;
