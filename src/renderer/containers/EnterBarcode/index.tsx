import { LabKeyOptionSelector } from "aics-react-labkey";
import * as classNames from "classnames";
import {
    debounce,
} from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state";

const styles = require("./style.css");
const BARCODES = [
    "550000012",
    "3500002386",
    "3500002385",
    "3500002370",
];

interface EnterBarcodeProps {
    className?: string;
    getPlateFromBarcode: (barcode: string) => void;
}

interface EnterBarcodeState {
    barcode?: string;
    error?: string;
}

interface BarcodeOption {
    barcode: string;
}

class EnterBarcode extends React.Component<EnterBarcodeProps, EnterBarcodeState> {
    private static getBarcodesAsync(input: string): Promise<{options: BarcodeOption[]} | null> {
        if (!input) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => setTimeout(resolve, 500, {
            options: BARCODES.map((b: string) => ({barcode: b})),
        }));
    }

    constructor(props: EnterBarcodeProps) {
        super(props);
        this.state = {};
        this.setBarcode = this.setBarcode.bind(this);
        EnterBarcode.getBarcodesAsync = debounce(EnterBarcode.getBarcodesAsync, 500);
    }

    public render() {
        const {barcode, error} = this.state;
        const {className} = this.props;
        return (
            <div
                className={classNames(className, styles.container)}
            >
                <div className={styles.form}>
                    <div className={styles.formPrompt}>
                        Enter a plate barcode associated with at least one of these files to the left.
                    </div>
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
                        loadOptions={EnterBarcode.getBarcodesAsync}
                        autoload={false}
                    />
                </div>

            </div>
        );
    }

    private setBarcode(option: BarcodeOption): void {
        this.setState(option);
        // this.props.getPlateFromBarcode(option.barcode);

        // tslint:disable-next-line
        console.log(option.barcode);
    }
}

function mapStateToProps(state: State) {
    return {

    };
}

const dispatchToPropsMap = {
    // tslint:disable-next-line
    getPlateFromBarcode: (barcode: string) => console.log(barcode),
};

export default connect(mapStateToProps, dispatchToPropsMap)(EnterBarcode);
