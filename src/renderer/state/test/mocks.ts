import { AppPage } from "../selection/types";
import { State } from "../types";

export const mockState: State = {
    isLoading: false,
    metadata: {},
    selection: {
        files: [],
        page: AppPage.DragAndDrop,
        stagedFiles: [],
    },
};
