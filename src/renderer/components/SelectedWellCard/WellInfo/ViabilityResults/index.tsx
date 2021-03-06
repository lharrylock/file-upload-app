import { Divider } from "antd";
import { FunctionComponent } from "react";
import * as React from "react";

import { ViabilityResult } from "../../../../state/selection/types";

import { NULL_TEXT } from "..";
import KeyValueDisplay from "../KeyValueDisplay";

const styles = require("../style.pcss");

export interface ViabilityResultsProps {
    className?: string;
    viabilityResults: ViabilityResult[];
}

const ViabilityResults: FunctionComponent<ViabilityResultsProps> =
    (props: ViabilityResultsProps) => {
    const {
        className,
        viabilityResults,
    } = props;

    return (
        <div className={className}>
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
                            <Divider dashed={true} className={styles.subDivider}>Viability Result {i + 1}</Divider>
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
