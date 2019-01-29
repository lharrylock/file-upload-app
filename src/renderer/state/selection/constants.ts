import { makeConstant } from "../util";

import { Well } from "./types";

const BRANCH_NAME = "selection";

export const ADD_STAGE_FILES = makeConstant(BRANCH_NAME, "add-stage-files");
export const DESELECT_FILE = makeConstant(BRANCH_NAME, "deselect-file");
export const SELECT_BARCODE = makeConstant(BRANCH_NAME, "select-barcode");
export const SELECT_FILE = makeConstant(BRANCH_NAME, "select-file");
export const SELECT_METADATA = makeConstant(BRANCH_NAME, "select-metadata");
export const LOAD_FILES = makeConstant(BRANCH_NAME, "load-files");
export const OPEN_FILES = makeConstant(BRANCH_NAME, "open-files");
export const SELECT_PAGE = makeConstant(BRANCH_NAME, "select-page");
export const UPDATE_STAGED_FILES = makeConstant(BRANCH_NAME, "update-staged-files");
export const GET_FILES_IN_FOLDER = makeConstant(BRANCH_NAME, "get-files-in-folder");
export const SET_WELLS = makeConstant(BRANCH_NAME, "set_wells");

// todo remove
export const WELLS: Well[][] = [
    [
        {
            cellPopulations: [],
            id: 1,
            modified: false,
            solutions: [],
            viabilityResults: [],
        },
        {
            cellPopulations: [{
                seedingDensity: "777",
                shortid: "asdfsdfs",
                sourceCellPopulation: {
                    cellLineId: 1,
                    cellLineName: "AICS-12",
                    cellPopulationId: 33,
                    clone: "22",
                    edits: [],
                    passage: 32,
                    plateBarcode: "879230001",
                    plateId: 1,
                    seedingDensity: "200",
                    stageId: 42,
                    stageName: "My Stage Name",
                    wellId: 4553,
                    wellLabel: "A1",
                },
                wellCellPopulation: {
                    cellLineId: 1,
                    cellLineName: "AICS-12",
                    cellPopulationId: 33,
                    clone: "22",
                    edits: [],
                    passage: 32,
                    plateBarcode: "879230001",
                    plateId: 1,
                    seedingDensity: "200",
                    stageId: 42,
                    stageName: "My Stage Name",
                    wellId: 4553,
                    wellLabel: "A1",
                },
            }],
            id: 1,
            modified: true,
            solutions: [{
                shortid: "asdfsdfs",
                solutionLot: {
                    "Catalog": "catalog",
                    "Concentration": 3434,
                    "ConcentrationUnitsId/Name": "uL",
                    "DilutionFactorPart": {}, // todo
                    "DilutionFactorTotal": {}, // todo
                    "Lot": "My Lot",
                    "Name/SolutionLotName": "Solution Lot Name",
                    "SolutionId/Name": "Some other name",
                    "SolutionLotId": 1,
                    "VendorId/Name": "My Vendor",
                },
                volume: "340",
                volumeUnits: {
                    Description: "MilliLiter",
                    Name: "ML-name",
                    Type: "type",
                    UnitsId: 1,
                },
            }],
            viabilityResults: [{
                shortid: "shortid",
                suspensionVolume: "100",
                suspensionVolumeUnits: {
                    Description: "MilliLiter",
                    Name: "ML-name",
                    Type: "type",
                    UnitsId: 1,
                },
                viability: "4444",
                viableCellCountPerUnit: "1e5",
                viableCellCountUnits: {
                    Description: "MilliLiter",
                    Name: "ML-name",
                    Type: "type",
                    UnitsId: 1,
                },
            }],
        },
    ],
    [
        {
            cellPopulations: [],
            id: 1,
            modified: false,
            solutions: [],
            viabilityResults: [],
        },
        {
            cellPopulations: [],
            id: 1,
            modified: false,
            solutions: [],
            viabilityResults: [],
        },
    ],
];
