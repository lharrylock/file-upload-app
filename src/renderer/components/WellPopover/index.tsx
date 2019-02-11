import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";

import { Well } from "../../state/selection/types";

import CellPopulationsPopoverContent from "./CellPopulationsPopoverContent/index";
import SolutionsPopoverContent from "./SolutionsPopoverContent/index";
import ViabilityResultsPopoverContent from "./ViabilityResultsPopoverContent/index";

const styles = require("./style.css");

export interface WellPopoverProps {
    className?: string;
    well: Well;
}

const WellPopover: React.FunctionComponent<WellPopoverProps> = (props) => {
    const {
        className,
        well,
    } = props;
    const { cellPopulations, solutions, viabilityResults } = well;

    return (
        <div className={classNames(styles.container, className)}>
            <CellPopulationsPopoverContent cellPopulations={cellPopulations}/>
            {!isEmpty(solutions) && <hr/>}
            <SolutionsPopoverContent solutions={solutions}/>
            {!isEmpty(viabilityResults) && <hr/>}
            <ViabilityResultsPopoverContent viabilityResults={viabilityResults}/>
        </div>
    );
};

export default WellPopover;
