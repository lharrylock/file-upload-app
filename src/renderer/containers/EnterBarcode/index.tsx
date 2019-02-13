import { LabkeyOption, LabKeyOptionSelector } from "aics-react-labkey";
import * as React from "react";
import { connect } from "react-redux";

import FormPage from "../../components/FormPage";
import { State } from "../../state";
import { selectBarcode } from "../../state/selection/actions";
import { getSelectedBarcode } from "../../state/selection/selectors";
import { SelectBarcodeAction } from "../../state/selection/types";
import LabkeyQueryService from "../../util/labkey-query-service";
import { Plate } from "../../util/labkey-query-service";

const styles = require("./style.css");

interface EnterBarcodeProps {
    className?: string;
    barcode?: string;
    selectBarcode: (barcode: string, plateId: number) => SelectBarcodeAction;
}

interface EnterBarcodeState {
    barcode?: string;
    plateId?: number;
}

class EnterBarcode extends React.Component<EnterBarcodeProps, EnterBarcodeState> {
    private static getBarcodesAsync(input: string): Promise<{options: LabkeyOption[]} | null> {
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
    }

    public render() {
        const {barcode, plateId} = this.state;
        const {className} = this.props;
        return (
            <FormPage
                className={className}
                formTitle="PLATE BARCODE"
                formPrompt="Enter a barcode associated with at least one of these files."
                saveButtonDisabled={!this.state.barcode}
                onSave={this.saveAndContinue}
            >
                <LabKeyOptionSelector
                    required={true}
                    async={true}
                    label="Plate Barcode"
                    optionIdKey="barcode"
                    optionNameKey="barcode"
                    selected={{barcode, plateId}}
                    onOptionSelection={this.setBarcode}
                    loadOptions={EnterBarcode.getBarcodesAsync}
                    placeholder="barcode"
                />
                <a href="#" className={styles.createBarcodeLink}>I don't have a barcode</a>
            </FormPage>
        );
    }

    private setBarcode(option: LabkeyOption | null): void {
        if (option) {
            this.setState(option);
        } else {
            this.setState({
                barcode: undefined,
                plateId: undefined,
            });
        }
    }

    private saveAndContinue(): void {
        if (this.state.barcode && this.state.plateId) {
            this.props.selectBarcode(this.state.barcode, this.state.plateId);
        }
    }
}

function mapStateToProps(state: State) {
    return {
        barcode: getSelectedBarcode(state),
    };
}

const dispatchToPropsMap = {
    selectBarcode,
};

export default connect(mapStateToProps, dispatchToPropsMap)(EnterBarcode);
