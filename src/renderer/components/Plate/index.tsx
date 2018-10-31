import { AicsGrid, AicsGridCell } from "aics-react-labkey";
import * as classNames from "classnames";
import * as React from "react";

import Well from "../Well/index";

const styles = require("./style.css");

interface PlateProps {
    className?: string;
}

interface PlateState {
    selectedWells: AicsGridCell[];
    wells: any[][];
}

class Plate extends React.Component<PlateProps, PlateState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedWells: [],
            wells: [[{name: "lisa"}]],
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

    public handleSelectedWellsChanged(cells: AicsGridCell[]): void {
        console.log("cells", cells);
    }

    public wellColorSelector(cellData: any): string {
        return "orange";
    }

    public getWellDisplayText(cellData: any): string | JSX.Element {
        return <Well/>;
    }

    public render() {
        const {
            className,
        } = this.props;
        const {
            selectedWells,
            wells,
        } = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <AicsGrid
                    selectMode="multi"
                    cellHeight="60px"
                    cellWidth="60px"
                    fontSize="20px"
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
