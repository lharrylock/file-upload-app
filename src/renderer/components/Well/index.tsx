import { Popover } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { CellPopulation, Solution, ViabilityResult, Well } from "../../state/selection/types";

const styles = require("./style.css");
const NULL_TEXT = "None";
const NULL_SAFE_GET_FIELD = (obj: any, field: string, nullText: string | null = NULL_TEXT) => {
    if (obj) {
        return obj[field] || nullText;
    }
    return nullText;
};

interface WellProps {
    className?: string;
    well: Well;
}

class WellComponent extends React.Component<WellProps, {}> {
    constructor(props: WellProps) {
        super(props);
        this.getWellText = this.getWellText.bind(this);
        this.getContent = this.getContent.bind(this);
        this.getCellPopulations = this.getCellPopulations.bind(this);
        this.getSolutions = this.getSolutions.bind(this);
        this.getViabilityResults = this.getViabilityResults.bind(this);
    }

    public getWellText() {
        const { well } = this.props;
        let wellText: JSX.Element | null = null;
        if (well.cellPopulations && well.cellPopulations.length > 0) {
            // The well is only big enough to fit the text for one Cell Population,
            // so show the info from the first one added
            const { wellCellPopulation } = well.cellPopulations[0];

            if (wellCellPopulation) {
                wellText = (
                    <React.Fragment>
                        <div className={styles.wellText}>{wellCellPopulation.cellLineName}</div>
                        <div className={styles.wellText}>{`C${wellCellPopulation.clone || "_N/A"}`}</div>
                        <div className={styles.wellText}>{`P${wellCellPopulation.passage || "_N/A"}`}</div>
                    </React.Fragment>
                );
            }
        }
        return wellText;
    }

    public getCellPopulations(cellPopulations: CellPopulation[]) {
        return cellPopulations.map((entry: CellPopulation, i) => {
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
                <React.Fragment key={entry.shortid}>
                    {i !== 0 && <hr />}
                    <strong>{`Cell Population ${i + 1}`}</strong><br />
                    {populationText}
                    <strong>Seeding Density: </strong>{entry.seedingDensity || NULL_TEXT}<br />
                </React.Fragment>
            );
        });
    }

    public getSolutions(solutions: Solution[]) {
        return solutions.map((entry, i) => {
            const solutionName = NULL_SAFE_GET_FIELD(entry.solutionLot, "SolutionId/Name");
            const concentration = NULL_SAFE_GET_FIELD(entry.solutionLot, "Concentration", null);
            const concentrationUnits = NULL_SAFE_GET_FIELD(entry.solutionLot, "ConcentrationUnitsId/Name", null);
            const dilutionFactorPart = NULL_SAFE_GET_FIELD(entry.solutionLot, "DilutionFactorPart", null);
            const dilutionFactorTotal = NULL_SAFE_GET_FIELD(entry.solutionLot, "DilutionFactorTotal", null);
            const volume = entry.volume || NULL_TEXT;
            const volumeUnits = NULL_SAFE_GET_FIELD(entry.volumeUnits, "Name", "");
            const vendor = NULL_SAFE_GET_FIELD(entry.solutionLot, "VendorId/Name");
            const catalog = NULL_SAFE_GET_FIELD(entry.solutionLot, "Catalog");
            const lot = NULL_SAFE_GET_FIELD(entry.solutionLot, "Lot");

            let concentrationLine: JSX.Element | null = null;
            // Due to a DB constraint, concentration and it"s units always both have values, or are both null
            if (concentration && concentrationUnits) {
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

            return (
                <React.Fragment key={entry.shortid}>
                    {i !== 0 && <hr />}
                    <strong>{`Solution ${i + 1}`}</strong><br />
                    <strong>Solution: </strong>{solutionName}<br />
                    {concentrationLine}
                    <strong>Volume: </strong>{volume} {volumeUnits}<br />
                    <strong>Vendor: </strong>{vendor}<br />
                    <strong>Catalog: </strong>{catalog}<br />
                    <strong>Lot: </strong>{lot}<br />
                </React.Fragment>
            );
        });
    }

    public getViabilityResults(viabilityResults: ViabilityResult[]) {
        return viabilityResults.map((result) => {
            const viableCellCountPerUnit = result.viableCellCountPerUnit || NULL_TEXT;
            const viableCellCountsUnits = NULL_SAFE_GET_FIELD(result.viableCellCountUnits, "Name", "");
            const suspensionVolume = result.suspensionVolume || NULL_TEXT;
            const suspensionVolumeUnits = NULL_SAFE_GET_FIELD(result.suspensionVolumeUnits, "Name", "");

            return (
                <React.Fragment key={result.shortid}>
                    <strong>Viability Result</strong><br />
                    <strong>Viability: </strong>{result.viability || NULL_TEXT}<br />
                    <strong>Viable Cell Count: </strong>{viableCellCountPerUnit}/{viableCellCountsUnits}<br />
                    <strong>Suspension Volume: </strong>{suspensionVolume} {suspensionVolumeUnits}<br />
                </React.Fragment>
            );
        });
    }

    public getContent() {
        const { well } = this.props;
        const { cellPopulations, solutions, viabilityResults } = well;
        return (
            <div>
                {cellPopulations && this.getCellPopulations(cellPopulations)}
                <hr/>
                {solutions && this.getSolutions(solutions)}
                <hr/>
                {viabilityResults && this.getViabilityResults(viabilityResults)}
            </div>
        );
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
            <Popover content={this.getContent()} title="Entered Well Information">
                {wellContent}
            </Popover>
        );
    }
}

export default WellComponent;
