import { expect } from "chai";
import { difference } from "lodash";

import { getMockStateWithHistory, mockState } from "../../test/mocks";
import { getWellIdToFiles } from "../selectors";

describe("Upload selectors", () => {
    describe("getWellIdToFiles", () => {
        it("returns an empty map given no uploads", () => {
           const map = getWellIdToFiles({
               ...mockState,
               upload: getMockStateWithHistory({}),
           });

           expect(map.size).to.equal(0);
        });

        it("aggregates all files associated with a well given multiple files", () => {
            const wellId = 2;
            const wellId2 = 5;
            const map = getWellIdToFiles({
                ...mockState,
                upload: getMockStateWithHistory({
                    "/path1": {wellId},
                    "/path2": {wellId},
                    "/path3": {wellId},
                    "/path4": {wellId: wellId2},
                }),
            });

            expect(map.size).to.equal(2);
            const filesForWell1 = map.get(wellId);
            expect(filesForWell1).to.not.be.undefined;

            if (filesForWell1) {

                expect(difference(filesForWell1, ["/path1", "/path2", "/path3"]).length).to.equal(0);
            }

            const filesForWell2 = map.get(wellId2);
            expect(filesForWell2).to.not.be.undefined;

            if (filesForWell2) {
                expect(difference(filesForWell2, ["/path4"]).length).to.equal(0);
            }
        });
    });
});
