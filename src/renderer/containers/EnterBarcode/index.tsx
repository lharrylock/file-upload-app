import { LabKeyOptionSelector } from "aics-react-labkey";
import { Button } from "antd";
import * as classNames from "classnames";
import {
    debounce,
} from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state";
import LabkeyQueryService from "../../util/labkey-query-service";
import { Plate } from "../../util/labkey-query-service/index";

const styles = require("./style.css");

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
    plateId: number;
}

class EnterBarcode extends React.Component<EnterBarcodeProps, EnterBarcodeState> {
    private static getBarcodesAsync(input: string): Promise<{options: BarcodeOption[]} | null> {
        if (!input) {
            return Promise.resolve(null);
        }

        return LabkeyQueryService.Get.platesByBarcode(input).then((plates: Plate[]) => ({
            options: plates.map((plate: Plate) => ({barcode: plate.BarCode, plateId: plate.PlateId})),
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
                <div className={styles.title}>PLATE BARCODE</div>
                <div className={styles.formPrompt}>
                    Enter a barcode associated with at least one of these files.
                </div>
                <div className={styles.form}>
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
                        placeholder="barcode"
                        loadOptions={EnterBarcode.getBarcodesAsync}
                        autoload={false}
                    />
                    <Button type="primary" size="large" className={styles.button}>Save and Continue</Button>
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
