import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import FormPage from "../../components/FormPage/index";

import {
    selection,
    State,
} from "../../state";
import { Well } from "../../state/selection/types";

const styles = require("./style.css");

interface Props {
    className?: string;
    wells?: Well[];
}

class AssociateWells extends React.Component<Props, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    public render() {
        const { className, wells } = this.props;
        console.log(wells);
        return (
            <FormPage
                className={classNames(className, styles.container)}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
                onSave={this.saveAndContinue}
            >
                <span>Hello from AssociateWells container</span>
            </FormPage>
        );
    }

    private saveAndContinue(): void {

    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        wells: selection.selectors.getWells(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
