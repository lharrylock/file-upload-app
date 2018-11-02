import { State } from "../types";

// BASIC SELECTORS
export const getWells = (state: State) => state.plate ? state.plate.wells : undefined;
