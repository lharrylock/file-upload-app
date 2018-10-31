import { LabKeyOptionSelector } from "aics-react-labkey";
import "aics-react-labkey-internal/dist/styles.css";
import { Button } from "antd";
import * as classNames from "classnames";
import { ipcRenderer } from "electron";
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
    error?: string;
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
        this.state = {};
        this.setBarcode = this.setBarcode.bind(this);
        this.openCreatePlateModal = this.openCreatePlateModal.bind(this);
        MetadataEntry.getBarcodesAsync = debounce(MetadataEntry.getBarcodesAsync, 500);
    }

    public setBarcode(option: BarcodeOption): void {
        this.setState(option);
    }

    public openCreatePlateModal(): void {
        ipcRenderer.send("OPEN_CREATE_PLATE");
    }

    public render() {
        const {barcode, error} = this.state;
        const {className, files} = this.props;
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
                    <LabKeyOptionSelector
                        required={true}
                        async={true}
                        id="single-selector-async"
                        label="Plate Barcode"
                        optionIdKey="barcode"
                        optionNameKey="barcode"
                        selected={barcode}
                        onOptionSelection={this.setBarcode}
                        disabled={false}
                        error={error}
                        clearable={true}
                        placeholder="Enter barcode"
                        helpText="Enter barcode if plate exists or click 'Create Plate'"
                        loadOptions={MetadataEntry.getBarcodesAsync}
                        autoload={false}
                    />
                    <Button onClick={this.openCreatePlateModal}>
                        Create Plate
                    </Button>
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
