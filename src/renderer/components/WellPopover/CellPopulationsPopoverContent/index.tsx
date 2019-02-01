import * as classNames from "classnames";
import * as React from "react";

import { CellPopulation } from "../../../state/selection/types";

const styles = require("./style.css");
const NULL_TEXT = "None";

export interface CellPopulationsPopoverContentProps {
    className?: string;
    cellPopulations?: CellPopulation[];
}

const CellPopulationsPopoverContent: React.SFC<CellPopulationsPopoverContentProps> = (props) => {
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
                                    <strong>Source Plate: </strong>{sourcePlateWell.plateBarcode}<br />
                                    <strong>Well: </strong>{sourcePlateWell.wellLabel}<br />
                                </React.Fragment>
                            );
                        } else if (sourceVial) {
                            sourceText = (
                                <React.Fragment>
                                    <strong>Source Vial: </strong>{sourceVial.barcode}<br />
                                </React.Fragment>
                            );
                        }

                        populationText = (
                            <React.Fragment>
                                {sourceText}
                                <strong>Cell Line: </strong>{wellCellPopulation.cellLineName}<br />
                                <strong>Clone: </strong>{wellCellPopulation.clone || NULL_TEXT}<br />
                                <strong>Passage: </strong>{wellCellPopulation.passage || NULL_TEXT}<br />
                            </React.Fragment>
                        );
                    }
                    return (
                        <React.Fragment key={i}>
                            {i !== 0 && <hr />}
                            <strong>{`Cell Population ${i + 1}`}</strong><br />
                            {populationText}
                            <strong>Seeding Density: </strong>{entry.seedingDensity || NULL_TEXT}<br />
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
};

export default CellPopulationsPopoverContent;
