import * as classNames from "classnames";
import * as React from "react";

import { Well } from "../../state/selection/types";

const styles = require("./style.css");

interface WellProps {
    className?: string;
    well: Well;
}

class WellComponent extends React.Component<WellProps, {}> {
    constructor(props: WellProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            className,
        } = this.props;
        const {} = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                Hello from Well
            </div>
        );
    }
}

export default WellComponent;
