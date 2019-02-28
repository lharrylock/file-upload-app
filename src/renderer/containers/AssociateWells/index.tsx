import { AicsGridCell } from "aics-react-labkey";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";
import WellInfo from "../../components/WellInfo/index";

import {
    State,
} from "../../state";
import { setWellsForUpload } from "../../state/selection/actions";
import {
    getSelectedFile,
    getSelectedWellAndFileAreAssociated,
    getWellForUpload,
    getWellsWithUnitsAndModified
} from "../../state/selection/selectors";
import { SetWellsForUploadAction, Well } from "../../state/selection/types";
import { associateFileAndWell, undoFileWellAssociation } from "../../state/upload/actions";
import { getWellIdToFiles } from "../../state/upload/selectors";
import { AssociateFileAndWellAction, UndoFileWellAssociationAction } from "../../state/upload/types";

const styles = require("./style.css");

interface AssociateWellsProps {
    associateFileAndWell: ActionCreator<AssociateFileAndWellAction>;
    className?: string;
    selectedFile?: string;
    selectedWell?: AicsGridCell;
    setWellsForUpload: ActionCreator<SetWellsForUploadAction>;
    wells?: Well[][];
    wellIdToFiles: Map<number, string[]>;
    selectedWellAndFileAreAssociated: boolean;
    undoAssociation: ActionCreator<UndoFileWellAssociationAction>;
}

class AssociateWells extends React.Component<AssociateWellsProps, {}> {
    private static getWellDisplay(well?: AicsGridCell): string {
        if (!well) {
            return "None";
        }

        const row = String.fromCharCode(97 +  (well.row % 26)).toUpperCase();
        const col = well.col + 1;
        return `${row}${col}`;
    }

    constructor(props: AssociateWellsProps) {
        super(props);
        this.associate = this.associate.bind(this);
        this.selectWell = this.selectWell.bind(this);
        this.getSelectedWell = this.getSelectedWell.bind(this);
        this.canAssociate = this.canAssociate.bind(this);
        this.undoAssociation = this.undoAssociation.bind(this);
    }

    public render() {
        const { className, selectedFile, selectedWell, wells, wellIdToFiles } = this.props;
        const selectedWells = selectedWell ? [selectedWell] : [];
        const wellInfo = wells && selectedWell ? wells[selectedWell.row][selectedWell.col] : undefined;
        const files = wellInfo && wellIdToFiles.has(wellInfo.wellId) ? wellIdToFiles.get(wellInfo.wellId) : [];

        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
            >
                <WellInfo
                    className={styles.wellInfo}
                    well={wellInfo}
                    wellDisplay={AssociateWells.getWellDisplay(selectedWell)}
                    files={files || []}
                    selectedFile={selectedFile}
                    associate={this.associate}
                    canAssociate={this.canAssociate()}
                    undoAssociation={this.undoAssociation}
                />
                {wells ? (
                        <Plate
                            wells={wells}
                            onWellClick={this.selectWell}
                            selectedWells={selectedWells}
                            wellIdToFiles={wellIdToFiles}
                        />
                    ) : <span>Plate does not have any well information!</span>}
            </FormPage>
        );
    }

    public selectWell(row: number, col: number): void {
        this.props.setWellsForUpload([{row, col}]);
    }

    private canAssociate(): boolean {
        return !!(this.props.selectedFile && this.props.selectedWell) && !this.props.selectedWellAndFileAreAssociated;
    }

    private associate(): void {
        const { selectedWell, wells } = this.props;

        if (this.canAssociate() && selectedWell && wells) {
            const { selectedFile } = this.props;
            this.setState({selectedWell: undefined});
            const wellId = wells[selectedWell.row][selectedWell.col].wellId;
            this.props.associateFileAndWell(selectedFile, wellId, selectedWell);
        }
    }

    private undoAssociation(file: string): void {
        this.props.undoAssociation(file);
    }

    private getSelectedWell(): string {
        const { selectedWell } = this.props;

        // todo none text const
        // todo B6 rather than 2, 6
        return selectedWell ? `${selectedWell.row}, ${selectedWell.col}` : "None";
    }
}

function mapStateToProps(state: State) {
    return {
        selectedFile: getSelectedFile(state),
        selectedWell: getWellForUpload(state),
        selectedWellAndFileAreAssociated: getSelectedWellAndFileAreAssociated(state),
        wellIdToFiles: getWellIdToFiles(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {
    associateFileAndWell,
    setWellsForUpload,
    undoAssociation: undoFileWellAssociation,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
