import { AicsGrid, AicsGridCell } from "aics-react-labkey";
import * as classNames from "classnames";
import * as React from "react";

import { Well } from "../../state/plate/types";

import WellComponent from "../Well";

const styles = require("./style.css");

interface PlateProps {
    className?: string;
    wells: Well[][];
}

interface PlateState {
    selectedWells: AicsGridCell[];
}

class Plate extends React.Component<PlateProps, PlateState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedWells: [],
        };
        this.handleWellClick = this.handleWellClick.bind(this);
        this.handleSelectedWellsChanged = this.handleSelectedWellsChanged.bind(this);
        this.wellColorSelector = this.wellColorSelector.bind(this);
        this.getWellDisplayText = this.getWellDisplayText.bind(this);
    }

    public handleWellClick(event: React.MouseEvent<HTMLDivElement>, row: number, col: number, data: any): void {
        console.log("row", row);
        console.log("col", col);
        console.log("data", data);
    }

    public handleSelectedWellsChanged(selectedWells: AicsGridCell[]): void {
        console.log(selectedWells);
        this.setState({selectedWells});
    }

    public wellColorSelector(cellData: Well): string {
        return cellData.modified ? "rgb(221, 216, 241)" : "rgb(226, 228, 227)";
    }

    public getWellDisplayText(cellData: Well): string | JSX.Element {
        return <WellComponent well={cellData}/>;
    }

    public render() {
        const {
            className,
            wells,
        } = this.props;
        const {
            selectedWells,
        } = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <AicsGrid
                    selectMode="multi"
                    cellHeight="80px"
                    cellWidth="80px"
                    fontSize="14px"
                    selectedCells={selectedWells}
                    onCellClick={this.handleWellClick}
                    onSelectedCellsChanged={this.handleSelectedWellsChanged}
                    displayBackground={this.wellColorSelector}
                    displayText={this.getWellDisplayText}
                    cells={wells}
                />
            </div>
        );
    }

}

export default Plate;
