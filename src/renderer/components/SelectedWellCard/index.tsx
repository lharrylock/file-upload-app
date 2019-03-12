import { Button, Card, Tabs } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Well } from "../../state/selection/types";
import WellFileAssociations from "./WellFileAssociations/index";
import WellInfo from "./WellInfo/index";

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
    public render() {
        const {
            associate,
            canAssociate,
            canRedo,
            canUndoLastAssociation,
            className,
            files,
            redo,
            selectedFilesCount,
            undoAssociation,
            undoLastAssociation,
            well,
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
            <Card className={classNames(className, styles.container)} title={title}>
                <Tabs type="card">
                    <Tabs.TabPane tab="Associated Files" key="associations">
                        <WellFileAssociations
                            className={styles.tabPane}
                            associate={associate}
                            canAssociate={canAssociate}
                            files={files}
                            selectedFilesCount={selectedFilesCount}
                            undoAssociation={undoAssociation}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Well Info" key="info" className={styles.tabPane}>
                        <WellInfo className={styles.tabPane} well={well}/>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        );
    }
}

export default SelectedWellCard;
