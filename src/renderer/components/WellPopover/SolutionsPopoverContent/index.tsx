import * as classNames from "classnames";
import * as React from "react";

import { Solution } from "../../../state/selection/types";

const styles = require("./style.css");
const NULL_TEXT = "None";

export interface SolutionsPopoverContentProps {
    className?: string;
    solutions?: Solution[];
}

const SolutionsPopoverContent: React.SFC<SolutionsPopoverContentProps> = (props) => {
    const {
        className,
        solutions,
    } = props;

    if (!solutions || solutions.length === 0) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            {solutions.map(({solutionLot, volume, volumeUnitsId}: Solution, i) => {
                const {
                    concentration,
                    concentrationUnitsId,
                    dilutionFactorPart,
                    dilutionFactorTotal,
                    solutionName,
                } = solutionLot;

                let concentrationLine: JSX.Element | null = null;
                // Due to a DB constraint, concentration and it"s units always both have values, or are both null
                if (concentration && concentrationUnitsId) {
                    // todo: get human readable value using id
                    const concentrationUnits = "TODO";
                    concentrationLine = (
                        <React.Fragment>
                            <strong>Concentration: </strong>{concentration} {concentrationUnits}<br />
                        </React.Fragment>
                    );
                    // Due to a DB constraint, dilution factor part and total always both have values, or are both null
                } else if (dilutionFactorPart && dilutionFactorTotal) {
                    concentrationLine = (
                        <React.Fragment>
                            <strong>Dilution Factor: </strong>{dilutionFactorPart}:{dilutionFactorTotal}<br />
                        </React.Fragment>
                    );
                }

                // todo: get human readable value using id
                const volumeUnits = "TODO";

                return (
                    <React.Fragment key={i}>
                        {i !== 0 && <hr />}
                        <strong>{`Solution ${i + 1}`}</strong><br />
                        <strong>Solution: </strong>{solutionName || NULL_TEXT}<br />
                        {concentrationLine}
                        <strong>Volume: </strong>{volume || NULL_TEXT} {volumeUnits}<br />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default SolutionsPopoverContent;
