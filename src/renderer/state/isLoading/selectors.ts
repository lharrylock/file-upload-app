import { State } from "../types";

// BASIC SELECTORS
export const getValue = (state: State) => state.isLoading;
