import { Popover } from "antd";
import * as classNames from "classnames";
import { first } from "lodash";
import * as React from "react";

import { CellPopulation, Well } from "../../state/selection/types";
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

    private getWellText() {
        const { well } = this.props;

        const cellPopulation: CellPopulation | undefined = first(well.cellPopulations);
        if (cellPopulation) {

            const wellCellPopulation = cellPopulation.wellCellPopulation;
            if (wellCellPopulation) {
                return (
                    <React.Fragment>
                        <div className={styles.wellText}>{wellCellPopulation.cellLineName}</div>
                        <div className={styles.wellText}>{`C${wellCellPopulation.clone || "_N/A"}`}</div>
                        <div className={styles.wellText}>{`P${wellCellPopulation.passage || "_N/A"}`}</div>
                    </React.Fragment>
                );
            }
        }

        return null;
    }
}

export default WellComponent;
