import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { setWells } from "./actions";

import { GET_PLATE_FROM_BARCODE } from "./constants";
import { Well } from "./types";

const getPlateFromBarcodeLogic = createLogic({
    transform: ({ action }: ReduxLogicDeps, next: (action: AnyAction) => void) => {
        const wells: Well[][] = [
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
        next(setWells(wells));
    },
    type: GET_PLATE_FROM_BARCODE,
});

export default [
    getPlateFromBarcodeLogic,
];
