import { LabkeyOption } from "aics-react-labkey";

export class BarcodeOption implements LabkeyOption {
    public barcode: string = "";
    public plateId: number = 0;
}
