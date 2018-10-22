import { LabKeyOptionSelector } from "aics-react-labkey";
import "aics-react-labkey-internal/dist/styles.css";
import { Button, Modal } from "antd";
import * as classNames from "classnames";
import { debounce } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state";
import { getSelectedFiles } from "../../state/selection/selectors";

const styles = require("./style.css");
const BARCODES = [
    "550000012",
    "3500002386",
    "3500002385",
    "3500002370",
];

interface Props {
    className?: string;
    files?: string[];
}

interface MetadataEntryState {
    barcode?: string;
    confirmCreatePlateModalLoading: boolean;
    error?: string;
    showCreatePlateModal: boolean;
}

interface BarcodeOption {
    barcode: string;
}

class MetadataEntry extends React.Component<Props, MetadataEntryState> {
    private static getBarcodesAsync(input): Promise<{options: BarcodeOption[]} | null> {
        if (!input) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => setTimeout(resolve, 1000, {
            options: BARCODES.map((b: string) => ({barcode: b})),
        }));
        // It's a good idea to prime the cache this way when debouncing
        // this.asyncCache = { '': [] };
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            confirmCreatePlateModalLoading: false,
            showCreatePlateModal: false,
        };
        this.setBarcode = this.setBarcode.bind(this);
        this.openCreatePlateModal = this.openCreatePlateModal.bind(this);
        this.handleCreatePlateModalOk = this.handleCreatePlateModalOk.bind(this);
        this.handleCreatePlateModalCancel = this.handleCreatePlateModalCancel.bind(this);
        MetadataEntry.getBarcodesAsync = debounce(MetadataEntry.getBarcodesAsync, 500);
    }

    public setBarcode(option: BarcodeOption): void {
        this.setState(option);
    }

    public openCreatePlateModal(): void {
        this.setState({showCreatePlateModal: true});
    }

    public handleCreatePlateModalOk(): void {
        this.setState({
            confirmCreatePlateModalLoading: true,
        });
        setTimeout(() => {
            this.setState({
                confirmCreatePlateModalLoading: false,
                showCreatePlateModal: false,
            });
        }, 2000);
    }

    public handleCreatePlateModalCancel(): void {
        this.setState({showCreatePlateModal: false});
    }

    public render() {
        const {className, files} = this.props;
        const {confirmCreatePlateModalLoading, showCreatePlateModal} = this.state;
        const noFiles = !files || files.length === 0;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                <h1>Metadata</h1>
                {noFiles &&
                <div className={styles.noDocumentsText}>
                    <div>No files selected.</div>
                    <div>Select one or more files to get started.</div>
                </div>}
                {!noFiles && files != null &&
                (
                    <div>
                        <h2>Selected Files:</h2>
                        {files.map((file: string) => <div key={file}>{file}</div>)}
                    </div>
                )}
                <div>
                    Plate Barcode:
                    <LabKeyOptionSelector
                        required={true}
                        async={true}
                        id="single-selector-async"
                        label="Plate Barcode"
                        optionIdKey="barcode"
                        optionNameKey="barcode"
                        selected={this.state.barcode}
                        onOptionSelection={this.setBarcode}
                        disabled={false}
                        error={this.state.error}
                        clearable={true}
                        placeholder="Enter barcode"
                        helpText="Enter barcode if plate exists or click 'Create Plate'"
                        loadOptions={MetadataEntry.getBarcodesAsync}
                        autoload={false}
                    />
                    <Button onClick={this.openCreatePlateModal}>
                        Create Plate
                    </Button>
                    <Modal
                        title="Title"
                        visible={showCreatePlateModal}
                        onOk={this.handleCreatePlateModalOk}
                        confirmLoading={confirmCreatePlateModalLoading}
                        onCancel={this.handleCreatePlateModalCancel}
                    >
                        <p>Labkey</p>
                    </Modal>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: Props): Props {
    return {
        className: props.className,
        files: getSelectedFiles(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(MetadataEntry);
