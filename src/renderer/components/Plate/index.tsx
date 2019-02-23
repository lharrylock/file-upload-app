import { AicsGrid, AicsGridCell } from "aics-react-labkey";
import * as React from "react";

import { Well } from "../../state/selection/types";

import WellComponent from "../Well";

const MODIFIED_WELL_COLOR = "rgb(221, 216, 241)";
const DEFAULT_WELL_COLOR = "rgb(226, 228, 227)";
const WELL_WIDTH = "60px";

interface PlateProps {
    className?: string;
    onWellClick: (well: Well, row: number, col: number) => void;
    wells: Well[][];
}

interface PlateState {
    selectedWells: AicsGridCell[];
}

class Plate extends React.Component<PlateProps, PlateState> {
    public static getWellDisplayText(cellData: Well): JSX.Element {
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
    }

    public handleWellClick(event: React.MouseEvent<HTMLDivElement>, row: number, col: number, data: Well): void {
        event.preventDefault();

        if (data.modified) {
            this.setState({selectedWells: [{col, row}]});
            this.props.onWellClick(data, row, col);
        }
    }

    public render() {
        const {
            className,
            wells,
        } = this.props;

        return (
            <div className={className}>
                <AicsGrid
                    selectMode="single"
                    cellHeight={WELL_WIDTH}
                    cellWidth={WELL_WIDTH}
                    fontSize="14px"
                    selectedCells={this.state.selectedWells}
                    displayBackground={Plate.wellColorSelector}
                    displayText={Plate.getWellDisplayText}
                    cells={wells}
                    onCellClick={this.handleWellClick}
                />
            </div>
        );
    }
}

export default Plate;
