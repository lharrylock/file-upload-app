import { expect } from "chai";

import { mockState, mockUnits } from "../../test/mocks";
import { State } from "../../types";
import { getWellsWithModified, getWellsWithUnitsAndModified } from "../selectors";
import { CellPopulation, Solution, ViabilityResult, Well } from "../types";

describe("Selections selectors", () => {
    let mockEmptyWell: Well;
    let mockCellPopulation: CellPopulation;
    let mockSolution: Solution;
    let mockViabilityResult: ViabilityResult;
    let mockStateWithNonEmptyWell: State;

    beforeEach(() => {
        mockEmptyWell = {
            cellPopulations: [],
            solutions: [],
            viabilityResults: [],
            wellId: 1,
        };

        mockCellPopulation = {
            seedingDensity: "200",
            wellCellPopulation: {
                cellPopulationId: 1,
            },
        };

        mockSolution =  {
            solutionLot: {
                concentration: 10,
                concentrationUnitsId: 2,
                dilutionFactorPart: 1,
                dilutionFactorTotal: 1000,
                solutionName: "testSolution",
            },
            volume: "100",
            volumeUnitId: 1,
        };

        mockViabilityResult = {
            suspensionVolume: "1000",
            suspensionVolumeUnitId: 3,
            viability: 91.9,
            viableCellCountPerUnit: 88,
            viableCellCountUnitId: 4,
        };

        const mockWell: Well = {
            ...mockEmptyWell,
            cellPopulations: [mockCellPopulation],
            solutions: [mockSolution],
            viabilityResults: [mockViabilityResult],
        };

        mockStateWithNonEmptyWell = {
            ...mockState,
            metadata: {
                ...mockState.metadata,
                units: mockUnits,
            },
            selection: {
                ...mockState.selection,
                wells: [[mockWell]],
            },
        };
    });

    describe ("getWellsWithModified", () => {
        it("sets modified as true on wells with cellPopulations", () => {
            const result: Well[][] | undefined = getWellsWithModified({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    wells: [
                        [
                            {
                                ...mockEmptyWell,
                                cellPopulations: [mockCellPopulation],
                            },
                        ],
                    ],
                },
            });
            expect(!!result).to.be.true;

            if (result && result[0][0]) {
                expect(result[0][0].modified).to.be.true;
            }
        });
        it("sets modified as true on wells with solutions", () => {
            const result: Well[][] | undefined = getWellsWithModified({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    wells: [
                        [
                            {
                                ...mockEmptyWell,
                                solutions: [mockSolution],
                            },
                        ],
                    ],
                },
            });
            expect(!!result).to.be.true;

            if (result && result[0][0]) {
                expect(result[0][0].modified).to.be.true;
            }
        });
        it("sets modified as true on wells with viabilityResults", () => {
            const result: Well[][] | undefined = getWellsWithModified({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    wells: [
                        [
                            {
                                ...mockEmptyWell,
                                viabilityResults: [mockViabilityResult],
                            },
                        ],
                    ],
                },
            });
            expect(!!result).to.be.true;

            if (result && result[0][0]) {
                expect(result[0][0].modified).to.be.true;
            }
        });

        it ("sets modified as false on wells without modifications", () => {
            const result: Well[][] | undefined = getWellsWithModified({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    wells: [[mockEmptyWell]],
                },
            });

            expect(!!result).to.be.true;

            if (result && result[0][0]) {
                expect(result[0][0].modified).to.be.false;
            }
        });
    });

    describe("getWellsWithUnitsAndModified", () => {
        it("returns unmodified wells if no units", () => {
            const state = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    wells: [[mockEmptyWell]],
                },
            };

            const result = getWellsWithUnitsAndModified(state);

            expect(getWellsWithModified(state)).to.equal(result);
        });

        it("returns undefined if wells undefined", () => {
            const result = getWellsWithUnitsAndModified({
                ...mockState,
                metadata: {
                    ...mockState.metadata,
                    units: mockUnits,
                },
            });
            expect(result).to.be.undefined;
        });

        it("populates display values", () => {
            const result = getWellsWithUnitsAndModified(mockStateWithNonEmptyWell);

            expect(!!result).to.be.true;
            expect(result).to.not.be.empty;

            if (result && result[0][0]) {
                const well = result[0][0];
                expect(well.solutions[0].volumeUnitDisplay).to.equal("unit1");
                expect(well.solutions[0].solutionLot.concentrationUnitsDisplay).to.equal("unit2");
                expect(well.viabilityResults[0].suspensionVolumeUnitDisplay).to.equal("unit3");
                expect(well.viabilityResults[0].viableCellCountUnitDisplay).to.equal("unit4");
            }
        });
    });
});
