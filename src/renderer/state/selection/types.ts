import { MetadataStateBranch } from "../metadata/types";

export interface UploadFile {
    name: string;
    path: string;
    files: UploadFile[];
    fullPath: string;
    isDirectory: boolean;
    loadFiles(): Promise<Array<Promise<UploadFile>>>;
}

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
    barcode?: string;
    plateId?: number;
    page: AppPage;
    stagedFiles: UploadFile[];
}

export interface SelectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}

export interface PopulationEdit {
    cas9BatchId: number;
    cas9BatchName: string;
    crRnaBatchId: number;
    crRnaBatchName: string;
    donorPlasmidBatchId: number;
    donorPlasmidBatchName: string;
}
export interface CellPopulationInfo {
    cellLineId?: number;
    cellLineName?: string;
    cellPopulationId?: number;
    clone?: string;
    edits?: PopulationEdit[];
    passage?: number;
    plateBarcode?: string;
    plateId?: number;
    seedingDensity?: string;
    stageId?: number;
    stageName?: string;
    wellId?: number;
    wellLabel?: string;
}

export interface SolutionLot {
    concentration: number;
    concentrationUnitsId: number;
    concentrationUnitsDisplay?: string;
    dilutionFactorPart: number;
    dilutionFactorTotal: number;
    solutionName: string;
}

export interface CellPopulation {
    seedingDensity: string;
    sourceCellPopulation?: CellPopulationInfo;
    sourcePlateWell?: CellPopulationInfo;
    sourceVial?: {
        barcode: string;
    };
    wellCellPopulation?: CellPopulationInfo;
}

export interface Solution {
    solutionLot: SolutionLot;
    volume: string;
    volumeUnitId: number;
    volumeUnitDisplay?: string;
}

export interface ViabilityResult {
    suspensionVolume: string;
    suspensionVolumeUnitId: number;
    suspensionVolumeUnitDisplay?: string;
    viability: number;
    viableCellCountPerUnit: number;
    viableCellCountUnitId: number;
    viableCellCountUnitDisplay?: string;
}

export interface Well {
    wellId: number;
    cellPopulations: CellPopulation[];
    modified?: boolean;
    solutions: Solution[];
    viabilityResults: ViabilityResult[];
}

export interface LoadFilesFromDragAndDropAction {
    payload: DragAndDropFileList;
    type: string;
}

export interface LoadFilesFromOpenDialogAction {
    payload: string[];
    type: string;
}

export interface AddStageFilesAction {
    payload: UploadFile[];
    type: string;
}

export interface SelectPageAction {
    payload: AppPage;
    type: string;
}

export interface UpdateStagedFilesAction {
    payload: UploadFile[];
    type: string;
}

export interface GetFilesInFolderAction {
    payload: UploadFile;
    type: string;
}

export interface SelectBarcodeAction {
    payload: {
        barcode: string;
        plateId: number;
    };
    type: string;
}

export interface SetWellsAction {
    payload: Well[][];
    type: string;
}

export interface DragAndDropFileList {
    readonly length: number;
    [index: number]: DragAndDropFile;
}

export interface DragAndDropFile {
    readonly name: string;
    readonly path: string;
}

export enum AppPage {
    DragAndDrop = 1,
    EnterBarcode,
    AssociateWells,
    UploadJobs,
    UploadComplete,
}

export interface AppPageConfig {
    container: JSX.Element;
    folderTreeVisible: boolean;
    folderTreeSelectable: boolean;
}
