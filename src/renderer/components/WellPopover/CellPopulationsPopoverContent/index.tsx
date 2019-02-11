import * as classNames from "classnames";
import * as React from "react";

import { CellPopulation } from "../../../state/selection/types";
import KeyValueDisplay from "../KeyValueDisplay";

const styles = require("../style.css");
const NULL_TEXT = "None";

export interface CellPopulationsPopoverContentProps {
    className?: string;
    cellPopulations?: CellPopulation[];
}

const CellPopulationsPopoverContent: React.FunctionComponent<CellPopulationsPopoverContentProps> = (props) => {
    const {
        className,
        cellPopulations,
    } = props;

    if (!cellPopulations || cellPopulations.length === 0) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            {
                cellPopulations.map((entry: CellPopulation, i) => {
                    const {
                        sourcePlateWell,
                        sourceVial,
                        wellCellPopulation,
                    } = entry;
                    let populationText: JSX.Element | undefined;
                    if (wellCellPopulation) {
                        // Show Source Plate Well or Vial info if available
                        let sourceText: JSX.Element | null = null;
                        if (sourcePlateWell) {
                            sourceText = (
                                <React.Fragment>
                                    <KeyValueDisplay keyName="Source Plate" value={sourcePlateWell.plateBarcode}/>
                                    <KeyValueDisplay keyName="Well" value={sourcePlateWell.wellLabel}/>
                                </React.Fragment>
                            );
                        } else if (sourceVial) {
                            sourceText = (
                                <React.Fragment>
                                    <KeyValueDisplay keyName="Source Vial" value={sourceVial.barcode}/>
                                </React.Fragment>
                            );
                        }

                        populationText = (
                            <React.Fragment>
                                {sourceText}
                                <KeyValueDisplay keyName="Cell Line" value={wellCellPopulation.cellLineName}/>
                                <KeyValueDisplay keyName="Clone" value={wellCellPopulation.clone || NULL_TEXT}/>
                                <KeyValueDisplay keyName="Passage" value={wellCellPopulation.passage || NULL_TEXT}/>
                            </React.Fragment>
                        );
                    }
                    return (
                        <React.Fragment key={i}>
                            {i !== 0 && <hr />}
                            <div className={styles.label}>{`Cell Population ${i + 1}`}</div>
                            {populationText}
                            <KeyValueDisplay keyName="Seeding Density" value={entry.seedingDensity || NULL_TEXT}/>
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
};

export default CellPopulationsPopoverContent;
