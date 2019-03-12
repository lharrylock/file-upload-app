import { Divider } from "antd";
import * as classNames from "classnames";
import { FunctionComponent } from "react";
import * as React from "react";
import { ViabilityResult } from "../../../../state/selection/types";

import { NULL_TEXT } from "../index";
import KeyValueDisplay from "../KeyValueDisplay/index";

const styles = require("../style.css");

export interface ViabilityResultsProps {
    className?: string;
    viabilityResults?: ViabilityResult[];
}

const ViabilityResults: FunctionComponent<ViabilityResultsProps> =
    (props: ViabilityResultsProps) => {
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
                        suspensionVolumeUnitDisplay,
                        viability,
                        viableCellCountPerUnit,
                        viableCellCountUnitDisplay,
                    } = result;

                    return (
                        <React.Fragment key={i}>
                            <Divider dashed={true} className={styles.divider}>Viability Result {i + 1}</Divider>
                            <div className={styles.group}>
                                <KeyValueDisplay keyName="Viability" value={viability || NULL_TEXT}/>
                                <KeyValueDisplay
                                    keyName="Viable Cell Count"
                                    value={`${viableCellCountPerUnit || NULL_TEXT}/${viableCellCountUnitDisplay}`}
                                />
                                <KeyValueDisplay
                                    keyName="Viable Cell Count"
                                    value={`${viableCellCountPerUnit || NULL_TEXT}/${viableCellCountUnitDisplay}`}
                                />
                                <KeyValueDisplay
                                    keyName="Suspension Volume"
                                    value={`${suspensionVolume || NULL_TEXT} ${suspensionVolumeUnitDisplay}`}
                                />
                            </div>
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
};

export default ViabilityResults;
