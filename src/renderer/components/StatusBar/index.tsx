import * as classNames from "classnames";
import * as React from "react";
import { HOST } from "../../constants";

const styles = require("./style.pcss");

export interface StatusBarProps {
    className?: string;
    status?: string;
}

const StatusBar: React.FunctionComponent<StatusBarProps> = (props) => {
    const {
        className,
        status,
    } = props;

    return (
        <div className={classNames(styles.container, className)}>
            <div className={styles.status}>{status || ""}</div>
            <div className={styles.host}>LIMS Host: {HOST}</div>
        </div>
    );
};

export default StatusBar;
