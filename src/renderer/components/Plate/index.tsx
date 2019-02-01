import { AicsGrid, AicsGridCell } from "aics-react-labkey";
import * as React from "react";

import { SelectWellsAction, Well } from "../../state/selection/types";

import WellComponent from "../Well";

const MODIFIED_WELL_COLOR = "rgb(221, 216, 241)";
const DEFAULT_WELL_COLOR = "rgb(226, 228, 227)";
const WELL_WIDTH = "80px";

interface PlateProps {
    className?: string;
    selectWells?: (wells: number[]) => SelectWellsAction;
    wells: Well[][];
}

interface PlateState {
    selectedWells: AicsGridCell[];
}

class Plate extends React.Component<PlateProps, PlateState> {
    public static getWellDisplayText(cellData: Well): string | JSX.Element {
        return <WellComponent well={cellData}/>;
    }

    public static wellColorSelector(cellData: Well): string {
        return cellData.modified ? MODIFIED_WELL_COLOR : DEFAULT_WELL_COLOR;
    }

    constructor(props: PlateProps) {
        super(props);
        this.state = {
            selectedWells: [],
        };
        this.handleWellClick = this.handleWellClick.bind(this);
        this.handleSelectedWellsChanged = this.handleSelectedWellsChanged.bind(this);
    }

    public handleWellClick(event: React.MouseEvent<HTMLDivElement>, row: number, col: number, data: Well): void {
        event.preventDefault();
        if (this.props.selectWells) {
            this.props.selectWells([data.wellId]);
        }
    }

    public handleSelectedWellsChanged(selectedWells: AicsGridCell[]): void {
        this.setState({selectedWells});
    }

    public render() {
        const {
            className,
            wells,
        } = this.props;

        return (
            <div className={className}>
                <AicsGrid
                    selectMode="multi"
                    cellHeight={WELL_WIDTH}
                    cellWidth={WELL_WIDTH}
                    fontSize="14px"
                    selectedCells={this.state.selectedWells}
                    onCellClick={this.handleWellClick}
                    onSelectedCellsChanged={this.handleSelectedWellsChanged}
                    displayBackground={Plate.wellColorSelector}
                    displayText={Plate.getWellDisplayText}
                    cells={wells}
                />
            </div>
        );
    }
}

export default Plate;
