// todo create npm module so this can be shared
declare module "aics-react-labkey-internal" {
    export interface CrRnaBatch {
        CrRnaId: number;
        Name: string;
    }

    export interface AicsCellPopulationBatchesProps {
        donorPlasmid: string;
        gene: string;
        tagLocation: string;
        crRnaBatch?: CrRnaBatch;
        crRnaBatchRequired?: boolean;
        crRnaBatchOptions?: Array<{
            Name: string;
            CrRnaId: number;
        }>;
        donorPlasmidBatch?: {
            DonorPlasmidBatchId: number;
            Name: string;
        };
        donorPlasmidBatchRequired?: boolean;
        donorPlasmidBatchOptions?: Array<{
            Name: string;
            DonorPlasmidBatchId: number;
        }>;
        cas9Batch?: {
            Cas9Id: number;
            Name: string;
        };
        cas9BatchOptions?: Array<{
            Name: string;
            Cas9BatchId: number;
        }>;
        cas9BatchRequired?: boolean;
        handleDataChange?: () => void;
        readOnly?: boolean;
    }
    export class AicsCellPopulationBatches extends React.Component<AicsCellPopulationBatchesProps, {}> {
        constructor(props: AicsCellPopulationBatchesProps);
        public render(): JSX.Element | null;
    }

    export interface CellLine {
        CellLineId: number;
        Name: string;
    }

    export interface Stage {
        StageId: number;
        Name: string;
    }

    export interface AicsCellPopulationGeneralProps {
        cellLine?: CellLine;
        cellLineOptions: Array<{
            Name: string;
            CellLineId: number;
        }>;
        clone?: string;
        passage?: string;
        stage?: Stage;
        stageOptions: Array<{
            Name: string;
            StageId: number;
        }>;
        isDifferentiated: boolean;
        handleDataChange: () => void;
        readOnly?: boolean;
        includeClone?: boolean;
    }

    // todo fix linter?
    // tslint:disable-next-line
    export class AicsCellPopulationGeneral extends React.Component<AicsCellPopulationGeneralProps, {}> {
        constructor(props: AicsCellPopulationGeneralProps);
        public render(): JSX.Element | null;
    }
}
