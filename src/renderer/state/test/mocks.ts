import { Unit } from "../metadata/types";
import { Page, Well } from "../selection/types";
import { State } from "../types";

export const mockState: State = {
    feedback: {
        isLoading: false,
        requestsInProgress: [],
    },
    metadata: {
        units: [],
    },
    selection: {
        files: [],
        page: Page.DragAndDrop,
        stagedFiles: [],
        wells: [],
        wellsForUpload: [],
    },
    upload: {

    },
};

export const mockUnits: Unit[] = [
    {
        description: "",
        name: "unit1",
        type: "volume",
        unitsId: 1,
    },
    {
        description: "",
        name: "unit2",
        type: "volume",
        unitsId: 2,
    },
    {
        description: "",
        name: "unit3",
        type: "mass",
        unitsId: 3,
    },
    {
        description: "",
        name: "unit4",
        type: "mass",
        unitsId: 4,
    },
];

export const mockWell: Well = {
    cellPopulations: [],
    solutions: [],
    viabilityResults: [],
    wellId: 1,
};

export const mockWells: Well[][] = [
    [mockWell, {...mockWell, wellId: 2}],
    [{...mockWell, wellId: 3}, {...mockWell, wellId: 4}],
];
