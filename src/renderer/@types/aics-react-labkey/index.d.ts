// todo lisah 11/15/18 DT-51 create npm module so this can be shared
declare module "aics-react-labkey" {
    export interface LabkeyOptionWithoutDisplayName {
        [optionIdKey: string]: string;
    }

    export interface LabkeyOptionWithDisplayName extends LabkeyOptionWithoutDisplayName {
        [optionNameKey: string]: string;
    }

    type LabkeyOption = LabkeyOptionWithoutDisplayName | LabkeyOptionWithDisplayName;

    export interface LabkeyOptionSelectorCommonProps {
        id: string;
        label: string;
        optionIdKey: string;
        optionNameKey?: string;
        selected?: LabkeyOption | LabkeyOption[];
        onOptionSelection: (option: LabkeyOption | null) => void;
        error?: boolean;
        multiSelect?: boolean;
        placeholder?: string;
        helpText?: string;
        style?: any; // style can have a lot of different attributes; and we don't need to validate them all
        required?: boolean;
    }

    // Default mode props
    export interface LabkeyOptionSelectorDefaultProps extends LabkeyOptionSelectorCommonProps {
        options: LabkeyOption[];
    }

    // Async mode props
    export interface LabkeyOptionSelectorAsyncProps extends LabkeyOptionSelectorCommonProps {
        async: boolean;
        loadOptions: () => Promise<{ options: LabkeyOption[] } | null>;
    }

    // Creatable mode props
    export interface LabkeyOptionSelectorCreateProps extends LabkeyOptionSelectorCommonProps {
        creatable: boolean;
    }

    type LabkeyOptionSelectorProps = LabKeyOptionSelectorDefaultProps | LabkeyOptionSelectorAsyncProps
        | LabkeyOptionSelectorCreateProps;

    export class LabKeyOptionSelector extends React.Component<LabKeyOptionSelectorProps, {}> {
        constructor(props: LabKeyOptionSelectorProps);
        public render(): JSX.Element | null;
    }

    export interface AicsGridCell {
        row: number;
        col: number;
    }

    export interface AicsGridProps {
        selectedCells: AicsGridCell[];
        selectMode: "multi" | "single" | "contiguous" | "non-contiguous" | "disabled";
        cellHeight?: string;
        cellWidth?: string;
        fontSize?: string;
        onCellClick?: (event: React.MouseEvent<HTMLDivElement>, row: number, col: number, data: any) => void;
        onSelectedCellsChanged?: (cells: AicsGridCell[]) => void;
        // cell keys look like `${rowIndex},${colIndex}`
        displayBackground: (cellData: any) => string;
        displayText: (cellData: any) => string | JSX.Element;
        cells: any[][];
    }

    // tslint:disable-next-line
    export class AicsGrid extends React.Component<AicsGridProps, {}> {
        constructor(props: AicsGridProps);
        public render(): JSX.Element | null;
    }
}
