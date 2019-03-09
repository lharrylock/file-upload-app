import { Button } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";
import WellFileAssociations from "../../components/WellFileAssociations/index";

import {
    State,
} from "../../state";
import { goBack, setWell } from "../../state/selection/actions";
import {
    getSelectedFiles,
    getWell,
    getWellsWithUnitsAndModified
} from "../../state/selection/selectors";
import { GoBackAction, SetWellAction, Well } from "../../state/selection/types";
import { associateFilesAndWell, jumpToUpload, undoFileWellAssociation } from "../../state/upload/actions";
import { getCanRedoUpload, getCanUndoUpload, getWellIdToFiles } from "../../state/upload/selectors";
import {
    AssociateFilesAndWellAction,
    JumpToUploadAction,
    UndoFileWellAssociationAction,
} from "../../state/upload/types";
import { getWellLabel } from "../../util/index";

import { GridCell } from "./grid-cell";

const styles = require("./style.css");

interface AssociateWellsProps {
    associateFilesAndWell: ActionCreator<AssociateFilesAndWellAction>;
    canRedo: boolean;
    canUndo: boolean;
    className?: string;
    goBack: ActionCreator<GoBackAction>;
    selectedFiles: string[];
    selectedWell?: GridCell;
    setWell: ActionCreator<SetWellAction>;
    wells?: Well[][];
    wellIdToFiles: Map<number, string[]>;
    jumpToUpload: ActionCreator<JumpToUploadAction>;
    undoAssociation: ActionCreator<UndoFileWellAssociationAction>;
}

class AssociateWells extends React.Component<AssociateWellsProps, {}> {
    constructor(props: AssociateWellsProps) {
        super(props);
        this.associate = this.associate.bind(this);
        this.selectWell = this.selectWell.bind(this);
        this.canAssociate = this.canAssociate.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }

    public render() {
        const { className, canRedo, canUndo, selectedFiles, selectedWell, wells, wellIdToFiles } = this.props;
        const selectedWells = selectedWell ? [selectedWell] : [];
        const wellInfo = wells && selectedWell ? wells[selectedWell.row][selectedWell.col] : undefined;
        const files = wellInfo ? wellIdToFiles.get(wellInfo.wellId) : [];

        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                onBack={this.props.goBack}
            >
                <WellFileAssociations
                    className={styles.wellInfo}
                    well={wellInfo}
                    wellLabel={getWellLabel(selectedWell)}
                    files={files || []}
                    selectedFilesCount={selectedFiles.length}
                    associate={this.associate}
                    canAssociate={this.canAssociate()}
                    undoAssociation={this.props.undoAssociation}
                    undoLastAssociation={this.undo}
                    redo={this.redo}
                    canRedo={canRedo}
                    canUndoLastAssociation={canUndo}
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
            this.props.associateFilesAndWell(selectedFiles, wellId);
        }
    }

    private undo(): void {
        this.props.jumpToUpload(-1);
    }

    private redo(): void {
        this.props.jumpToUpload(1);
    }
}

function mapStateToProps(state: State) {
    return {
        canRedo: getCanRedoUpload(state),
        canUndo: getCanUndoUpload(state),
        selectedFiles: getSelectedFiles(state),
        selectedWell: getWell(state),
        wellIdToFiles: getWellIdToFiles(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {
    associateFilesAndWell,
    goBack,
    jumpToUpload,
    setWell,
    undoAssociation: undoFileWellAssociation,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
