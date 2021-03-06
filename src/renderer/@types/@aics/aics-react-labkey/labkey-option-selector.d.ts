// todo lisah 11/15/18 DT-51 create npm module so this can be shared
declare module "@aics/aics-react-labkey" {
    export interface LabkeyOption {
        [id: string]: any;
    }

    export interface LabkeyOptionSelectorCommonProps {
        id?: string;
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
        loadOptions: (input: string) => Promise<{ options: LabkeyOption[] } | null>;
    }

    // Creatable mode props
    export interface LabkeyOptionSelectorCreateProps extends LabkeyOptionSelectorCommonProps {
        creatable: boolean;
    }

    type LabkeyOptionSelectorProps = LabkeyOptionSelectorDefaultProps | LabkeyOptionSelectorAsyncProps
        | LabkeyOptionSelectorCreateProps;

    export class LabKeyOptionSelector extends React.Component<LabkeyOptionSelectorProps, {}> {
        constructor(props: LabkeyOptionSelectorProps);
        public render(): JSX.Element | null;
    }
}
