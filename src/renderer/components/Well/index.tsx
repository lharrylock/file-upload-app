import { Popover } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface WellProps {
    className?: string;
}

interface WellState {
    test: string;
}

class Well extends React.Component<WellProps, WellState> {
    constructor(props: WellProps) {
        super(props);
        this.state = {
            test: "hello",
        };
        this.getContent();
    }

    public getContent() {
        return "Boo!";
    }

    public render() {
        const {
            className,
        } = this.props;
        const {} = this.state;

        return (
            <Popover content={this.getContent()} title="Title">
                <div className={classNames(styles.container, className)}>
                    Hello from Well
                </div>
            </Popover>
        );
    }
}

export default Well;
