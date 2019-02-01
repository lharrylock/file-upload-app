import { Popover } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Well } from "../../state/selection/types";
import WellPopover from "../WellPopover/index";

const styles = require("./style.css");

interface WellProps {
    className?: string;
    well: Well;
}

class WellComponent extends React.Component<WellProps, {}> {
    constructor(props: WellProps) {
        super(props);
        this.getWellText = this.getWellText.bind(this);
    }

    public getWellText() {
        const { well } = this.props;
        let wellText: JSX.Element | null = null;
        if (well.cellPopulations && well.cellPopulations.length > 0) {
            // The well is only big enough to fit the text for one Cell Population,
            // so show the info from the first one added
            const { wellCellPopulation } = well.cellPopulations[0];

            if (wellCellPopulation) {
                wellText = (
                    <React.Fragment>
                        <div className={styles.wellText}>{wellCellPopulation.cellLineName}</div>
                        <div className={styles.wellText}>{`C${wellCellPopulation.clone || "_N/A"}`}</div>
                        <div className={styles.wellText}>{`P${wellCellPopulation.passage || "_N/A"}`}</div>
                    </React.Fragment>
                );
            }
        }
        return wellText;
    }

    public render() {
        const {
            className,
            well,
        } = this.props;
        const {} = this.state;

        const wellContent = (
            <div className={classNames(styles.container, className)}>
                {this.getWellText()}
            </div>
        );

        if (!well.modified)  {
            return wellContent;
        }

        return (
            <Popover content={<WellPopover well={well}/>} title="Entered Well Information">
                {wellContent}
            </Popover>
        );
    }
}

export default WellComponent;
