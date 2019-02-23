import { Button, Col, Row, Statistic } from "antd";
import * as React from "react";
import { connect } from "react-redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";

import {
    State,
} from "../../state";
import { getSelectedFile, getWellsWithUnitsAndModified } from "../../state/selection/selectors";
import { Well } from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    selectedFile?: string;
    wells?: Well[][];
}

class AssociateWells extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.state = {};
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
                <Row className={styles.associateRow}>
                    <Col span={11}>
                        <Statistic title="Selected File" value={selectedFile || "None"} />
                    </Col>
                    <Col span={11}>
                        <Statistic title="Selected Well" value={112893} />
                    </Col>
                    <Col span={2}>
                        <Button style={{ marginTop: 16 }} type="primary">Associate</Button>
                    </Col>
                </Row>
                {wells ? <Plate wells={wells}/> : <span>Plate does not have any well information!</span>}
            </FormPage>
        );
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        selectedFile: getSelectedFile(state),
        wells: getWellsWithUnitsAndModified(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
