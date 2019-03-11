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
    undoLastAssociation: () => void;
    redo: () => void;
    canAssociate: boolean;
    canUndoLastAssociation: boolean;
    canRedo: boolean;
}

class SelectedWellCard extends React.Component<WellInfoProps, {}> {

    public constructor(props: WellInfoProps) {
        super(props);
        this.undoAssociation = this.undoAssociation.bind(this);
    }

    public render() {
        const {
            canRedo,
            canUndoLastAssociation,
            className,
            redo,
            undoLastAssociation,
            wellLabel,
        } = this.props;

        const title = (
            <div className={styles.titleRow}>
                <div className={styles.title}>Selected Well: {wellLabel}</div>

                <div className={styles.titleButtons}>
                    <Button
                        onClick={undoLastAssociation}
                        disabled={!canUndoLastAssociation}
                    >
                        Undo
                    </Button>
                    <Button
                        onClick={redo}
                        disabled={!canRedo}
                    >
                        Redo
                    </Button>
                </div>
            </div>
        );
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

        return files.map(this.renderFileRow, this);
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

export default SelectedWellCard;
