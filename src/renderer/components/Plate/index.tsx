import { AicsGrid, AicsGridCell } from "aics-react-labkey";
import * as React from "react";

import { Well } from "../../state/selection/types";

import WellComponent from "../Well";

const FINISHED_WELL_COLOR = "#52c41a";
const MODIFIED_WELL_COLOR = "rgb(221, 216, 241)";
const DEFAULT_WELL_COLOR = "rgb(226, 228, 227)";
const WELL_WIDTH = "60px";

interface PlateProps {
    className?: string;
    onWellClick: (row: number, col: number, well?: Well) => void;
    wells: Well[][];
    wellIdToFileCount: Map<number, number>;
    selectedWells: AicsGridCell[];
}

class Plate extends React.Component<PlateProps, {}> {
    public static getWellDisplayText(cellData: Well): JSX.Element {
        return <WellComponent well={cellData}/>;
    }

    constructor(props: PlateProps) {
        super(props);
        this.handleWellClick = this.handleWellClick.bind(this);
        this.wellColorSelector = this.wellColorSelector.bind(this);
    }

    public wellColorSelector(cellData: Well): string {
        if ((this.props.wellIdToFileCount.get(cellData.wellId) || 0) > 0) {
            return FINISHED_WELL_COLOR;
        }

        return cellData.modified ? MODIFIED_WELL_COLOR : DEFAULT_WELL_COLOR;
    }

    public handleWellClick(event: React.MouseEvent<HTMLDivElement>, row: number, col: number, data: Well): void {
        event.preventDefault();

        if (data.modified) {
            this.props.onWellClick(row, col, data);
        }
    }

    public render() {
        const {
            className,
            selectedWells,
            wells,
        } = this.props;

        return (
            <div className={className}>
                <AicsGrid
                    selectMode="single"
                    cellHeight={WELL_WIDTH}
                    cellWidth={WELL_WIDTH}
                    fontSize="14px"
                    selectedCells={selectedWells}
                    displayBackground={this.wellColorSelector}
                    displayText={Plate.getWellDisplayText}
                    cells={wells}
                    onCellClick={this.handleWellClick}
                />
            </div>
        );
    }
}

export default Plate;
