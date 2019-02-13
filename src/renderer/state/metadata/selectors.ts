import { State } from "../types";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getUnits = (state: State) => state.metadata.units;

// COMPOSED SELECTORS
