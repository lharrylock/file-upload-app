import * as classNames from "classnames";
import * as React from "react";

import { ViabilityResult } from "../../../state/selection/types";
import { NULL_TEXT } from "../index";
import KeyValueDisplay from "../KeyValueDisplay/index";

const styles = require("../style.css");

export interface ViabilityResultsPopoverContentProps {
    className?: string;
    viabilityResults?: ViabilityResult[];
}

const ViabilityResultsPopoverContent: React.FunctionComponent<ViabilityResultsPopoverContentProps> = (props) => {
    const {
        className,
        viabilityResults,
    } = props;

    if (!viabilityResults || viabilityResults.length === 0) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            {
                viabilityResults.map((result, i) => {
                    const {
                        suspensionVolume,
                        suspensionVolumeUnitId,
                        viability,
                        viableCellCountPerUnit,
                        viableCellCountUnitId,
                    } = result;

                    // todo: get human readable value using id
                    const viableCellCountsUnits = "TODO";
                    const suspensionVolumeUnits = "TODO";

                    return (
                        <React.Fragment key={i}>
                            <div className={styles.label}>Viability Result</div>
                            <KeyValueDisplay keyName="Viability" value={viability || NULL_TEXT}/>
                            <KeyValueDisplay
                                keyName="Viable Cell Count"
                                value={`${viableCellCountPerUnit || NULL_TEXT}/${viableCellCountsUnits}`}
                            />
                            <KeyValueDisplay
                                keyName="Viable Cell Count"
                                value={`${viableCellCountPerUnit || NULL_TEXT}/${viableCellCountsUnits}`}
                            />
                            <KeyValueDisplay
                                keyName="Suspension Volume"
                                value={`${suspensionVolume || NULL_TEXT} ${suspensionVolumeUnits}`}
                            />
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
};

export default ViabilityResultsPopoverContent;
