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
    seedingDensity: number;
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
    sourceCellPopulation: CellPopulationInfo;
    sourcePlateWell: CellPopulation;
    sourceVial: any; // todo
    wellCellPopulation: CellPopulationInfo;
}

export interface Solution {
    solutionLot: SolutionLot;
    volume: string;
    volumeUnits: Unit;
}

export interface ViabilityResult {
    suspensionVolume: string;
    suspensionVolumeUnits: Unit;
    viability: string;
    viableCellCountPerUnit: string;
    viableCellCountUnits: Unit;
}

export interface Well {
    cellPopulations: CellPopulation[];
    modified: boolean; // todo need?
    solutions: Solution[];
    viabilityResults: ViabilityResult[];
}
export interface Plate {
    wells: Well[][];
}
export interface PlateStateBranch {
    plate: Plate;
}

export interface GetPlateFromBarcodeAction {
    payload: string;
    type: string;
}
