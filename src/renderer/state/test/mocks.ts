import { Unit } from "../metadata/types";
import { Page, SelectionStateBranch, Well } from "../selection/types";
import { State } from "../types";

const mockSelection: SelectionStateBranch = {
    files: [],
    page: Page.DragAndDrop,
    stagedFiles: [],
    well: undefined,
    wells: [],
};

export const mockState: State = {
    feedback: {
        isLoading: false,
        requestsInProgress: [],
    },
    metadata: {
        history: {
            selection: {},
            upload: {},
        },
        units: [],
    },
    selection: {
        _latestUnfiltered: {...mockSelection},
        future: [],
        group: {},
        index: 0,
        limit: 10,
        past: [],
        present: {...mockSelection},
    },
    upload: {
        _latestUnfiltered: {},
        future: [],
        group: {},
        index: 0,
        limit: 10,
        past: [],
        present: {},
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
