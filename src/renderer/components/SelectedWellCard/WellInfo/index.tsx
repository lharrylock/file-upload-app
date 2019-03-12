import { Empty } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { Well } from "../../../state/selection/types";

import CellPopulations from "./CellPopulations";
import Solutions from "./Solutions";
import ViabilityResults from "./ViabilityResults";

const styles = require("./style.css");
export const NULL_TEXT = "None";

interface WellInfoProps {
    className?: string;
    well?: Well;
}

class WellInfo extends React.Component<WellInfoProps, []> {
    constructor(props: WellInfoProps) {
        super(props);
    }

    public render() {
        const {
            className,
            well,
        } = this.props;

        if (!well) {
            return <Empty/>;
        }

        const { cellPopulations, solutions, viabilityResults } = well;

        return (
            <div className={classNames(styles.container, className)}>
                <CellPopulations cellPopulations={cellPopulations}/>
                {!isEmpty(solutions) && <hr/>}
                <Solutions solutions={solutions}/>
                {!isEmpty(viabilityResults) && <hr/>}
                <ViabilityResults viabilityResults={viabilityResults}/>
            </div>
        );
    }
}

export default WellInfo;
