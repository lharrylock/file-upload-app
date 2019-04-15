import { expect } from "chai";
import { get } from "lodash";

import { getSelectedFiles } from "../../selection/selectors";
import { createMockReduxStore } from "../../test/configure-mock-store";
import { mockState } from "../../test/mocks";
import { associateFilesAndWell } from "../actions";
import { getUpload } from "../selectors";

describe("Upload logics", () => {
    describe("associateFileAndWellLogic", () => {
        it("clears files and associates well with file", () => {
            const store = createMockReduxStore(mockState);
            const file1 = "/path1";
            const file2 = "/path2";
            const wellId = 1;

            store.dispatch(associateFilesAndWell(["/path1", "/path2"], wellId));
            expect(getSelectedFiles(store.getState())).to.be.empty;

            const upload = getUpload(store.getState());
            expect(get(upload, [file1, "wellId"])).to.equal(wellId);
            expect(get(upload, [file2, "wellId"])).to.equal(wellId);
        });
    });
});
