import { createSelector } from "reselect";

import { getUnits } from "../metadata/selectors";
import { Unit } from "../metadata/types";
import { State } from "../types";

import { Solution, SolutionLot, ViabilityResult, Well } from "./types";

// BASIC SELECTORS
export const getSelectedBarcode = (state: State) => state.selection.barcode;
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getAppPage = (state: State) => state.selection.page;
export const getStagedFiles = (state: State) => state.selection.stagedFiles;
export const getWells = (state: State) => state.selection.wells;

// COMPOSED SELECTORS
const NO_UNIT = "";
export const getWellsWithUnits = createSelector([
    getWells,
    getUnits,
], (wells?: Well[][], units?: Unit[]): Well[][] | undefined => {
    if (!wells || !units) {
        return wells;
    }

    return wells.map((wellRow: Well[]) => wellRow.map((well) => {
        const solutions: Solution[] = well.solutions.map((s: Solution) => {
            const volumeUnit: Unit | undefined = units.find((u) => u.unitsId === s.volumeUnitId);
            const concentrationUnit: Unit | undefined = units
                .find((u) => u.unitsId === s.solutionLot.concentrationUnitsId);
            const solutionLot: SolutionLot = {
                ...s.solutionLot,
                concentrationUnitsDisplay: concentrationUnit ? concentrationUnit.name : NO_UNIT,
            };
            return {
                ...s,
                volumeUnitDisplay:  volumeUnit ? volumeUnit.name : NO_UNIT,
                ...solutionLot,
            };
        });
        const viabilityResults: ViabilityResult[] = well.viabilityResults.map((v: ViabilityResult) => {
            const unit: Unit | undefined = units.find((u) => u.unitsId === v.suspensionVolumeUnitId);
            return {
                ...v,
                viableCellCountUnitDisplay: unit ? unit.name : NO_UNIT,
            };
        });
        return {
            ...well,
            solutions,
            viabilityResults,
        };
    }));
});
