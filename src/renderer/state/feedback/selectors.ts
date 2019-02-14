import { State } from "../types";

// BASIC SELECTORS
export const getIsLoading = (state: State) => state.feedback.isLoading;
