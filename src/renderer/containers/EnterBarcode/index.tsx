import { LabKeyOptionSelector } from "aics-react-labkey";
import { Anchor, Button } from "antd";
import * as classNames from "classnames";
import { debounce } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../state";
import { selection } from "../../state";
import { SelectBarcodeAction } from "../../state/selection/types";
import LabkeyQueryService from "../../util/labkey-query-service";
import { Plate } from "../../util/labkey-query-service";

const styles = require("./style.css");

interface EnterBarcodeProps {
    className?: string;
    barcode?: string;
    selectBarcode: (barcode: string) => SelectBarcodeAction;
}

interface EnterBarcodeState {
    barcode?: string;
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
        this.state = {
            barcode: props.barcode,
        };
        this.setBarcode = this.setBarcode.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        EnterBarcode.getBarcodesAsync = debounce(EnterBarcode.getBarcodesAsync, 500);
    }

    public render() {
        const {barcode} = this.state;
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
                        clearable={true}
                        placeholder="barcode"
                        loadOptions={EnterBarcode.getBarcodesAsync}
                        autoload={false}
                    />
                    <a href="#" className={styles.createBarcodeLink}>I don't have a barcode</a>
                    <Button
                        type="primary"
                        size="large"
                        className={styles.button}
                        onClick={this.saveAndContinue}
                        disabled={!this.state.barcode}
                    >
                        Save and Continue
                    </Button>
                </div>
            </div>
        );
    }

    private setBarcode(option: BarcodeOption): void {
        this.setState(option);
    }

    private saveAndContinue(): void {
        if (this.state.barcode) {
            this.props.selectBarcode(this.state.barcode);
        }
    }
}

function mapStateToProps(state: State) {
    return {
        barcode: selection.selectors.getSelectedBarcode(state),
    };
}

const dispatchToPropsMap = {
    selectBarcode: selection.actions.selectBarcode,
};

export default connect(mapStateToProps, dispatchToPropsMap)(EnterBarcode);
