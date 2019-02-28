import { Alert, Button, Card, Col, Empty, Row, Statistic } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { Well } from "../../state/selection/types";

const styles = require("./style.css");

interface WellInfoProps {
    className?: string;
    selectedFile?: string;
    well?: Well;
    wellDisplay: string;
    files: string[];
    associate: () => void;
    undoAssociation: (file: string) => void;
    canAssociate: boolean;
}

class WellInfo extends React.Component<WellInfoProps, {}> {

    public constructor(props: WellInfoProps) {
        super(props);
        this.renderBody = this.renderBody.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
        this.renderFileRow = this.renderFileRow.bind(this);
        this.undoAssociation = this.undoAssociation.bind(this);
    }

    public render() {
        const { className, wellDisplay } = this.props;

        const title = `Selected Well: ${wellDisplay}`;
        return (
            <Card className={classNames(styles.container, className)} title={title}>
                {this.renderBody()}
            </Card>
        );
    }

    private renderBody() {
        const { associate, canAssociate, selectedFile, well } = this.props;

        if (!well) {
            return <Alert type="warning" message="No well selected"/>;
        }

        return (
            <React.Fragment>
                <div className={styles.files}>
                    {this.renderFiles()}
                </div>
                <Row className={styles.addRow}>
                    <Col span={20}>
                        <Statistic title="Selected File" value={selectedFile || "None"}/>
                    </Col>
                    <Col span={4}>
                        <Button
                            type="primary"
                            disabled={!canAssociate}
                            onClick={associate}
                        >
                            Associate
                        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    private renderFiles() {
        const { files } = this.props;
        if (isEmpty(files)) {
            return <Empty description="No Files"/>;
        }

        return files.map(this.renderFileRow);
    }

    private renderFileRow(file: string) {
        return (
            <Row className={styles.fileRow} key={file}>
                <Col span={20}>
                    {file}
                </Col>
                <Col span={4}>
                    <Button
                        type="default"
                        onClick={this.undoAssociation(file)}
                    >
                        Remove
                    </Button>
                </Col>
            </Row>
        );
    }

    private undoAssociation(file: string) {
        return () => this.props.undoAssociation(file);
    }
}

export default WellInfo;
