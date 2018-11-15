import { Tree } from "antd";
import { expect } from "chai";
import { shallow } from "enzyme";
import { resolve } from "path";
import * as React from "react";
import * as sinon from "sinon";

import FolderTree from "../";
import { selection } from "../../../state";
import { UploadFileImpl } from "../../../state/selection/models/upload-file";
import { UploadFile } from "../../../state/selection/types";

const DirectoryTree = Tree.DirectoryTree;

describe("<FolderTree/>", () => {
    const TEST_DIRNAME = resolve(__dirname);
    const FOLDER_NAME = "demo";
    const ON_CHECK = selection.actions.selectFile;

    let files: UploadFile[] = [];
    let testFolder: UploadFile;
    let testFolderKey: string;

    beforeEach(() => {
        testFolder = new UploadFileImpl(FOLDER_NAME, TEST_DIRNAME, true);
        files = [
            testFolder,
        ];
        testFolderKey = `${testFolder.fullPath}(folder)`;
    });

    describe("onExpand", () => {
        it("should get children if folder has not been expanded", (done) => {
            const getFilesInFolder = sinon.fake();
            const wrapper = shallow(
                <FolderTree
                        files={files}
                        getFilesInFolder={getFilesInFolder}
                        isSelectable={false}
                        onCheck={ON_CHECK}
                />
            );

            // update
            expect(wrapper.find(DirectoryTree).dive().exists()).to.equal(true);
            wrapper.find(DirectoryTree).dive()
                .simulate("expand", [testFolderKey]);

            setTimeout(() => {
                // after
                expect(getFilesInFolder.called).to.equal(true);
                done();
            }, 500);
        });

        it("should not get children if folder has been expanded", (done) => {
            const getFilesInFolder = sinon.fake();
            const wrapper = shallow(
                <FolderTree
                    files={files}
                    getFilesInFolder={getFilesInFolder}
                    isSelectable={false}
                    onCheck={ON_CHECK}
                />
            );

            // update
            const expandedFolders: Set<string> = new Set();
            expandedFolders.add(testFolderKey);
            wrapper.setState({
                expandedFolders,
            });
            wrapper.find(DirectoryTree).dive()
                .simulate("expand", [testFolderKey]);

            setTimeout(() => {
                // after
                expect(getFilesInFolder.called).to.equal(false);
                done();
            }, 500);
        });
    });


});
