import * as classNames from "classnames";
import * as React from "react";

interface WellInfoProps {
    className?: string;
}

class WellInfo extends React.Component<WellInfoProps, []> {
    constructor(props: WellInfoProps) {
        super(props);
    }

    public render() {
        const {
            className,
        } = this.props;
        const {} = this.state;

        return (
            <div className={classNames(className)}>
                Hello from WellInfo
            </div>
        );
    }
}

export default WellInfo;
