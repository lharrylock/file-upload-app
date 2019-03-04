import { Button, Card, Empty, Icon } from "antd";
import { isEmpty } from "lodash";
import * as React from "react";

import { Well } from "../../state/selection/types";

const styles = require("./style.css");

interface WellInfoProps {
    className?: string;
    selectedFilesCount: number;
    well?: Well;
    wellLabel: string;
    files: string[];
    associate: () => void;
    undoAssociation: (file: string) => void;
    canAssociate: boolean;
}

class WellFileAssociations extends React.Component<WellInfoProps, {}> {

    public constructor(props: WellInfoProps) {
        super(props);
        this.renderBody = this.renderBody.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
        this.renderFileRow = this.renderFileRow.bind(this);
        this.undoAssociation = this.undoAssociation.bind(this);
    }

    public render() {
        const { className, wellLabel } = this.props;

        const title = `Selected Well: ${wellLabel}`;
        return (
            <Card className={className} title={title}>
                {this.renderBody()}
            </Card>
        );
    }

    private renderBody() {
        const { associate, canAssociate, selectedFilesCount } = this.props;

        return (
            <div className={styles.cardContent}>
                <div className={styles.files}>
                    {this.renderFiles()}
                </div>
                <div className={styles.addRow}>
                    <div className={styles.title}>Selected File(s): {selectedFilesCount}</div>
                    <Button
                        type="primary"
                        disabled={!canAssociate}
                        onClick={associate}
                        className={styles.associateButton}
                    >
                        Associate
                    </Button>
                </div>
            </div>
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
            <div className={styles.fileRow} key={file}>
                <div className={styles.fileName}>
                    <Icon type="file" className={styles.fileIcon} />{file}
                </div>
                <div className={styles.deleteButton}>
                    <Button type="danger" shape="circle" icon="delete" onClick={this.undoAssociation(file)} />
                </div>
            </div>
        );
    }

    private undoAssociation(file: string) {
        return () => this.props.undoAssociation(file);
    }
}

export default WellFileAssociations;
