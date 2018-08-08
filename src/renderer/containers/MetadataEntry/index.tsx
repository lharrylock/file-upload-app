import { AicsCellPopulationBatches, AicsCellPopulationGeneral, Stage } from "aics-react-labkey-internal";
import "aics-react-labkey-internal/dist/styles.css";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state";

const styles = require("./style.css");

interface Props {
    className?: string;
}

interface MetadataEntryState {
    cellLine?: string;
    clone?: string;
    diffCellProtocol?: string;
    diffCellType?: string;
    // diffReadOnly: boolean;
    diffTime?: string;
    donorPlasmid: string;
    donorPlasmidBatch?: string;
    gene: string;
    includeClone?: boolean;
    isDifferentiated?: boolean;
    passage?: string;
    stage?: Stage;
    tagLocation: string;
}

const STAGE_OPTIONS = [
    { Name: "Pre-FACS Enrichment", StageId: 1 },
    { Name: "Post-FACS Enrichment", StageId: 2 },
    { Name: "Etcetera", StageId: 3 },
];

const CELL_LINE_OPTIONS = [
    { Name: "AICS-0", CellLineId: 1 },
];

const CRRNA_BATCH_OPTIONS = [
    { Name: "CrRnaBatch1", CrRnaId: 1 },
];

const DONOR_PLASMID_BATCH_OPTIONS = [
    { Name: "DonorPlasmidBatch1", DonorPlasmidBatchId: 1 },
];

const CAS_9_BATCH_OPTIONS = [
    { Name: "Cas9Batch1", Cas9BatchId: 1 },
];

class MetadataEntry extends React.Component<Props, MetadataEntryState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            // batchesReadOnly: false,
            // batchesRequired: false,
            // cellLine: null,
            clone: "",
            // diffCellProtocol: null,
            // diffCellType: null,
          //  diffReadOnly: false,
            diffTime: "",
            donorPlasmid: "plasmid",
            // donorPlasmidBatch: null,
            gene: "PXN",
            // generalReadOnly: false,
            includeClone: false,
            isDifferentiated: false,
            passage: "",
            // stage: null,
            tagLocation: "N-terminus",
        };

        this.handleGeneralDataChange = this.handleGeneralDataChange.bind(this);
    }

    public handleGeneralDataChange() {
        return true;
    }

    public render() {
        const {className} = this.props;
        const {
            donorPlasmid,
            gene,
            tagLocation,
        } = this.state;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                <AicsCellPopulationGeneral
                    cellLineOptions={CELL_LINE_OPTIONS}
                    stageOptions={STAGE_OPTIONS}
                    isDifferentiated={false}
                    handleDataChange={this.handleGeneralDataChange}
                />
                <AicsCellPopulationBatches
                    donorPlasmid={donorPlasmid}
                    gene={gene}
                    tagLocation={tagLocation}
                    crRnaBatchOptions={CRRNA_BATCH_OPTIONS}
                    donorPlasmidBatchOptions={DONOR_PLASMID_BATCH_OPTIONS}
                    cas9BatchOptions={CAS_9_BATCH_OPTIONS}
                    readOnly={false}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(MetadataEntry);
