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
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className, wells } = this.props;
        return (
            <FormPage
                className={className}
                formTitle="ASSOCIATE WELLS"
                formPrompt="Associate files and wells by selecting them and clicking Associate"
                saveButtonDisabled={true}
            >
                {wells ? <Plate wells={wells}/> : <span>"Oops no wells found"</span>}
            </FormPage>
        );
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        wells: selection.selectors.getWellsWithUnits(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(AssociateWells);
