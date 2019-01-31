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
    wells?: Well[];
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

export interface PopulationEdit {
    cas9BatchId: number;
    cas9BatchName: string;
    crRnaBatchId: number;
    crRnaBatchName: string;
    donorPlasmidBatchId: number;
    donorPlasmidBatchName: string;
}
export interface CellPopulationInfo {
    cellLineId: number;
    cellLineName: string;
    cellPopulationId: number;
    clone: string;
    edits: PopulationEdit[];
    passage: number;
    plateBarcode: string;
    plateId: number;
    seedingDensity: string;
    stageId: number;
    stageName: string;
    wellId: number;
    wellLabel: string;
}

// todo naming
export interface Unit {
    Description: string;
    Name: string;
    Type: string;
    UnitsId: number;
}

// todo change naming
export interface SolutionLot {
    Catalog: string;
    Concentration: number;
    "ConcentrationUnitsId/Name": string;
    DilutionFactorPart: any; // todo
    DilutionFactorTotal: any; // todo
    Lot: string;
    "Name/SolutionLotName": string;
    "SolutionId/Name": string;
    SolutionLotId: number;
    "VendorId/Name": string;
}

export interface CellPopulation {
    seedingDensity: string;
    shortid: string; // todo
    sourceCellPopulation?: CellPopulationInfo;
    sourcePlateWell?: CellPopulationInfo; // CellPopulation;
    sourceVial?: any; // todo
    wellCellPopulation?: CellPopulationInfo;
}

export interface Solution {
    shortid: string;
    solutionLot: SolutionLot;
    volume: string;
    volumeUnits: Unit;
}

export interface ViabilityResult {
    shortid: string;
    suspensionVolume: string;
    suspensionVolumeUnits: Unit;
    viability: string;
    viableCellCountPerUnit: string;
    viableCellCountUnits: Unit;
}

export interface Well {
    wellid: number;
    cellPopulations: CellPopulation[];
    modified?: boolean; // todo need?
    solutions: Solution[];
    viabilityResults: ViabilityResult[];
}
