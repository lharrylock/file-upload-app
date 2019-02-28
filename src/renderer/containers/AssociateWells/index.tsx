import { AicsGridCell } from "aics-react-labkey";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";

import {
    State,
} from "../../state";
import { setWellsForUpload } from "../../state/selection/actions";
import { getWellForUpload, getWellsWithUnitsAndModified } from "../../state/selection/selectors";
import { SetWellsForUploadAction, Well } from "../../state/selection/types";

interface Props {
    className?: string;
    selectedWell?: AicsGridCell;
    setWellsForUpload: ActionCreator<SetWellsForUploadAction>;
    wells?: Well[][];
}

class AssociateWells extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.selectWell = this.selectWell.bind(this);
    }

    public render() {
        const { className, selectedWell, wells } = this.props;
        const selectedWells = selectedWell ? [selectedWell] : [];
        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
            >
                {wells ? (
                        <Plate
                            wells={wells}
                            onWellClick={this.selectWell}
                            selectedWells={selectedWells}
                        />
                    ) : <span>Plate does not have any well information!</span>}
            </FormPage>
        );
    }

    public selectWell(row: number, col: number): void {
        this.props.setWellsForUpload([{row, col}]);
    }
}

function mapStateToProps(state: State) {
    return {
        selectedWell: getWellForUpload(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {
    setWellsForUpload,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
