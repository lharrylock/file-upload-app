import { Button, Card, Col, Row, Statistic } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";

import {
    State,
} from "../../state";
import { associateFileAndWell } from "../../state/selection/actions";
import { getSelectedFile, getWellsWithUnitsAndModified } from "../../state/selection/selectors";
import { AssociateFileAndWellAction, Well } from "../../state/selection/types";

const styles = require("./style.css");

interface AssociateWellsProps {
    associateFileAndWell: ActionCreator<AssociateFileAndWellAction>;
    className?: string;
    selectedFile?: string;
    wells?: Well[][];
}

interface AssociateWellsState {
    selectedWell?: Well;
}

class AssociateWells extends React.Component<AssociateWellsProps, AssociateWellsState> {
    constructor(props: AssociateWellsProps) {
        super(props);
        this.state = {};
        this.associate = this.associate.bind(this);
        this.selectWell = this.selectWell.bind(this);
        this.getSelectedWell = this.getSelectedWell.bind(this);
        this.canAssociate = this.canAssociate.bind(this);
    }

    public render() {
        const { className, selectedFile, wells } = this.props;

        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
            >
                <Card className={styles.form}>
                    <Row className={styles.associateRow}>
                        <Col span={4}>
                            <Statistic title="Selected Well" value={this.getSelectedWell()} />
                        </Col>
                        <Col span={20}>
                            <Statistic title="Selected File" value={selectedFile || "None"}/>
                        </Col>
                    </Row>
                    <Button
                        type="primary"
                        disabled={!this.canAssociate()}
                        onClick={this.associate}
                    >
                        Associate
                    </Button>
                </Card>

                {wells ? <Plate wells={wells} onWellClick={this.selectWell}/> :
                    <span>Plate does not have any well information!</span>}
            </FormPage>
        );
    }

    public selectWell(selectedWell: Well, row: number, column: number): void {
        this.setState({selectedWell});
    }

    private canAssociate(): boolean {
        return !!(this.props.selectedFile && this.state.selectedWell);
    }

    private associate(): void {
        const { selectedWell } = this.state;

        if (this.canAssociate() && selectedWell) {
            const { selectedFile } = this.props;
            this.setState({selectedWell: undefined});
            this.props.associateFileAndWell(selectedFile, selectedWell.wellId);
        }
    }

    private getSelectedWell(): string {
        const { selectedWell } = this.state;

        // todo none text const
        return selectedWell ? `${selectedWell.wellId}` : "None";
    }
}

function mapStateToProps(state: State) {
    return {
        selectedFile: getSelectedFile(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {
    associateFileAndWell,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
