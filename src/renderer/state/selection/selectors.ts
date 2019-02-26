import { AicsGridCell } from "aics-react-labkey";
import { first, isEmpty } from "lodash";
import { createSelector } from "reselect";

import { getUnits } from "../metadata/selectors";
import { Unit } from "../metadata/types";
import { State } from "../types";
import { getUpload } from "../upload/selectors";
import { UploadMetadata, UploadStateBranch } from "../upload/types";

import { Solution, SolutionLot, ViabilityResult, Well } from "./types";

// BASIC SELECTORS
export const getSelectedBarcode = (state: State) => state.selection.barcode;
export const getSelectedPlateId = (state: State) => state.selection.plateId;
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getAppPage = (state: State) => state.selection.page;
export const getStagedFiles = (state: State) => state.selection.stagedFiles;
export const getWells = (state: State) => state.selection.wells;
export const getWellsForUpload = (state: State) => state.selection.wellsForUpload;

// COMPOSED SELECTORS
export const NO_UNIT = "(Unit Not Found)";

export const getWellsWithModified = createSelector([getWells], (wells: Well[][]): Well[][] => {
    if (!wells || wells.length === 0) {
        return wells || [];
    }

    return wells.map(
        (row: Well[]) => row.map((well: Well) => ({
            ...well,
            modified: !isEmpty(well.cellPopulations) || !isEmpty(well.solutions) || !isEmpty(well.viabilityResults),
        }))
    );
});

export const getWellsWithUnitsAndModified = createSelector([
    getWellsWithModified,
    getUnits,
], (wells: Well[][], units: Unit[]): Well[][] => {
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
                solutionLot,
                volumeUnitDisplay:  volumeUnit ? volumeUnit.name : NO_UNIT,
            };
        });
        const viabilityResults: ViabilityResult[] = well.viabilityResults.map((v: ViabilityResult) => {
            const suspensionVolumUnit: Unit | undefined = units.find((u) => u.unitsId === v.suspensionVolumeUnitId);
            const viableCellCountUnit: Unit | undefined = units.find((u) => u.unitsId === v.viableCellCountUnitId);
            return {
                ...v,
                suspensionVolumeUnitDisplay: suspensionVolumUnit ? suspensionVolumUnit.name : NO_UNIT,
                viableCellCountUnitDisplay: viableCellCountUnit ? viableCellCountUnit.name : NO_UNIT,
            };
        });

        return {
            ...well,
            solutions,
            viabilityResults,
        };
    }));
});

export const getSelectedFile = createSelector([
    getSelectedFiles,
], (files: string[]) => {
    return first(files);
});

export const getWellForUpload = createSelector([
    getWellsForUpload,
], (wells: AicsGridCell[]) => {
    return first(wells);
});

export const getFileToGridCellMap = createSelector([
    getUpload,
    getSelectedFiles,
    getWells,
], (uploads: UploadStateBranch, selectedFiles: string[], wells: Well[][]) => {
   return selectedFiles.reduce((accum: Map<string, AicsGridCell | undefined>, fullPath: string) => {
       const uploadMetadataForFile: UploadMetadata = uploads[fullPath];
       let cell: AicsGridCell | undefined;
       if (uploadMetadataForFile) {
           const targetWellId = uploadMetadataForFile.wellId;
           wells.forEach((wellRow, row) => {
               wellRow.forEach((well, col) => {
                  if (well.wellId === targetWellId) {
                    cell = {row, col};
                  }
               });
           });
       }

       accum.set(fullPath, cell);
       return accum;
   }, new Map<string, AicsGridCell | undefined>());
});
