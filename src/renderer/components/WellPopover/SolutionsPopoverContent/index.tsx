import * as classNames from "classnames";
import * as React from "react";

import { Solution } from "../../../state/selection/types";
import { NULL_TEXT } from "../index";
import KeyValueDisplay from "../KeyValueDisplay/index";

const styles = require("../style.css");

export interface SolutionsPopoverContentProps {
    className?: string;
    solutions?: Solution[];
}

const SolutionsPopoverContent: React.FunctionComponent<SolutionsPopoverContentProps> = (props) => {
    const {
        className,
        solutions,
    } = props;

    if (!solutions || solutions.length === 0) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            {solutions.map(({solutionLot, volume, volumeUnitDisplay}: Solution, i) => {
                const {
                    concentration,
                    concentrationUnitsDisplay,
                    dilutionFactorPart,
                    dilutionFactorTotal,
                    solutionName,
                } = solutionLot;

                let concentrationLine: JSX.Element | undefined;
                // Due to a DB constraint, concentration and its units always both have values, or are both null
                if (concentration && concentrationUnitsDisplay) {
                    const concentrationDisplay = `${concentration} ${concentrationUnitsDisplay}`;
                    concentrationLine = (
                        <React.Fragment>
                            <KeyValueDisplay keyName="Concentration" value={concentrationDisplay}/>
                        </React.Fragment>
                    );
                // Due to a DB constraint, dilution factor part and total always both have values, or are both null
                } else if (dilutionFactorPart && dilutionFactorTotal) {
                    concentrationLine = (
                        <React.Fragment>
                            <KeyValueDisplay
                                keyName="Dilution Factor"
                                value={`${dilutionFactorPart}:${dilutionFactorTotal}`}
                            />
                        </React.Fragment>
                    );
                }

                return (
                    <React.Fragment key={i}>
                        {i !== 0 && <hr />}
                        <div className={styles.label}>{`Solution ${i + 1}`}</div>
                        <KeyValueDisplay keyName="Solution" value={solutionName || NULL_TEXT}/>
                        {concentrationLine}
                        <KeyValueDisplay keyName="Volume" value={`${volume || NULL_TEXT} ${volumeUnitDisplay}`}/>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default SolutionsPopoverContent;