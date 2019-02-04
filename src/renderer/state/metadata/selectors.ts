import { createSelector } from "reselect";

import { State } from "../types";

import { MetadataStateBranch } from "./types";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getUnits = (state: State) => state.metadata.units;

// COMPOSED SELECTORS
export const getKeysOfMetadata = createSelector([getMetadata], (metadata: MetadataStateBranch): string[] =>
    Object.keys(metadata)
);
