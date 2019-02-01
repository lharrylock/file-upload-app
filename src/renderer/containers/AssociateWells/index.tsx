import * as React from "react";
import { connect } from "react-redux";

import FormPage from "../../components/FormPage";
import Plate from "../../components/Plate/index";

import {
    selection,
    State,
} from "../../state";
import { Well } from "../../state/selection/types";

interface Props {
    className?: string;
    wells?: Well[][];
}

class AssociateWells extends React.Component<Props, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    public render() {
        const { className, wells } = this.props;
        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
                onSave={this.saveAndContinue}
            >
                {wells ? <Plate wells={wells}/> : "Oops no wells found"}
            </FormPage>
        );
    }

    private saveAndContinue(): void {
        const x = 1;
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
