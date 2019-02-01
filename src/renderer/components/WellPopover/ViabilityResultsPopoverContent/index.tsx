import * as classNames from "classnames";
import * as React from "react";

import { ViabilityResult } from "../../../state/selection/types";

const styles = require("./style.css");
const NULL_TEXT = "None";

export interface ViabilityResultsPopoverContentProps {
    className?: string;
    viabilityResults?: ViabilityResult[];
}

const ViabilityResultsPopoverContent: React.SFC<ViabilityResultsPopoverContentProps> = (props) => {
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
                            <strong>Viability Result</strong><br />
                            <strong>Viability: </strong>{viability || NULL_TEXT}<br />
                            <strong>Viable Cell Count: </strong>{viableCellCountPerUnit || NULL_TEXT}/{viableCellCountsUnits}<br/>
                            <strong>Suspension Volume: </strong>{suspensionVolume || NULL_TEXT} {suspensionVolumeUnits}<br />
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
};

export default ViabilityResultsPopoverContent;
