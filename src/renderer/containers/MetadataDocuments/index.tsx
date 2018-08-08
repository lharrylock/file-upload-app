import Button from "antd/es/button/button";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    //  selections,
    State,
} from "../../state";

const styles = require("./style.css");

interface Props {
    className?: string;
    documents?: any[]; // todo type
}

class MetadataDocuments extends React.Component<Props, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            className,
            documents,
        } = this.props;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                <h1>Metadata Documents</h1>
                {(!documents || documents.length === 0) &&
                <div className={styles.noDocumentsText}>
                    Looks like you don't have any metadata to send with your files.
                    Click the plus icon to create a metadata document.
                </div>}
                <Button shape="circle" icon="plus" type="primary" size="large" className={styles.fab}/>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        // filteredOutMesoStructures: selections.selectors.getFilteredOutMesoStructures(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(MetadataDocuments);
