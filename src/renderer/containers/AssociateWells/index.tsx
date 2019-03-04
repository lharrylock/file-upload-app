import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";
import WellFileAssociations from "../../components/WellFileAssociations/index";

import {
    State,
} from "../../state";
import { setWell } from "../../state/selection/actions";
import {
    getSelectedFiles,
    getWell,
    getWellsWithUnitsAndModified
} from "../../state/selection/selectors";
import { SetWellAction, Well } from "../../state/selection/types";
import { GridCell } from "../../state/types";
import { associateFilesAndWell, undoFileWellAssociation } from "../../state/upload/actions";
import { getWellIdToFiles } from "../../state/upload/selectors";
import { AssociateFilesAndWellAction, UndoFileWellAssociationAction } from "../../state/upload/types";
import { getWellDisplay } from "../../util/index";

const styles = require("./style.css");

interface AssociateWellsProps {
    associateFilesAndWell: ActionCreator<AssociateFilesAndWellAction>;
    className?: string;
    selectedFiles: string[];
    selectedWell?: GridCell;
    setWell: ActionCreator<SetWellAction>;
    wells?: Well[][];
    wellIdToFiles: Map<number, string[]>;
    undoAssociation: ActionCreator<UndoFileWellAssociationAction>;
}

class AssociateWells extends React.Component<AssociateWellsProps, {}> {
    constructor(props: AssociateWellsProps) {
        super(props);
        this.associate = this.associate.bind(this);
        this.selectWell = this.selectWell.bind(this);
        this.canAssociate = this.canAssociate.bind(this);
    }

    public render() {
        const { className, selectedFiles, selectedWell, wells, wellIdToFiles } = this.props;
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
                <WellFileAssociations
                    className={styles.wellInfo}
                    well={wellInfo}
                    wellDisplay={getWellDisplay(selectedWell)}
                    files={files || []}
                    selectedFilesCount={selectedFiles.length}
                    associate={this.associate}
                    canAssociate={this.canAssociate()}
                    undoAssociation={this.props.undoAssociation}
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
        this.props.setWell(new GridCell(row, col));
    }

    private canAssociate(): boolean {
        const { selectedFiles, selectedWell } = this.props;
        return !!selectedWell && selectedFiles.length > 0;
    }

    private associate(): void {
        const { selectedWell, wells } = this.props;

        if (this.canAssociate() && selectedWell && wells) {
            const { selectedFiles } = this.props;

            const wellId = wells[selectedWell.row][selectedWell.col].wellId;
            this.props.associateFilesAndWell(selectedFiles, wellId, selectedWell);
        }
    }
}

function mapStateToProps(state: State) {
    return {
        selectedFiles: getSelectedFiles(state),
        selectedWell: getWell(state),
        wellIdToFiles: getWellIdToFiles(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {
    associateFilesAndWell,
    setWell,
    undoAssociation: undoFileWellAssociation,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
