import { expect } from "chai";
import { resolve } from "path";

import createReduxStore from "../../configure-store";
import { mockState } from "../../test/mocks";

import selections from "../";
import { AppPage } from "../types";

describe("Selection logics", () => {
    const FILE_NAME = "cells.txt";
    const TEST_FILES_DIR = "files";
    const FOLDER_NAME = "a_directory";
    const FILE_FULL_PATH = resolve(__dirname, TEST_FILES_DIR, FILE_NAME);
    const FOLDER_FULL_PATH = resolve(__dirname, TEST_FILES_DIR, FOLDER_NAME);

    describe("loadFilesLogic", () => {
        let fileList: FileList;

        beforeEach(() => {
            fileList = {
                length: 2,
                0: {
                    name: FILE_NAME,
                    path: FILE_FULL_PATH,
                },
                1: {
                    name: FOLDER_NAME,
                    path: FOLDER_FULL_PATH,
                },
            } as unknown as FileList;
        });

        it("Goes to EnterBarcode page if on DragAndDrop page", () => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.DragAndDrop);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);
            });
        });

        it("Does not change page if not on DragAndDrop page", () => {
            const store = createReduxStore({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    page: AppPage.EnterBarcode,
                },
            });

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);
            });
        });

        it("stages all files loaded", () => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getStagedFiles(store.getState()).length).to.equal(0);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            store.subscribe(() => {
                // after
                const stagedFiles = selections.selectors.getStagedFiles(store.getState());
                expect(stagedFiles.length).to.equal(fileList.length);

                const file = stagedFiles[0];
                expect(file.getIsDirectory()).to.equal(false);
                expect(file.name).to.equal(FILE_NAME);
                expect(file.path).to.equal(resolve(__dirname, TEST_FILES_DIR));
                expect(file.fullPath).to.equal(FILE_FULL_PATH);

                const folder = stagedFiles[1];
                expect(folder.getIsDirectory()).to.equal(true);
                expect(folder.name).to.equal(FOLDER_NAME);
                expect(folder.path).to.equal(resolve(__dirname, TEST_FILES_DIR));
                expect(folder.fullPath).to.equal(FOLDER_FULL_PATH);
            });
        });
    });

    describe("openFilesLogic", () => {
        let filePaths: string[];

        beforeEach(() => {
            filePaths = [FILE_FULL_PATH];
        });

        it("Goes to EnterBarcode page if on DragAndDrop page", () => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.DragAndDrop);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);
            });
        });

        it("Does not change page if not on DragAndDrop page", () => {
            const store = createReduxStore({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    page: AppPage.EnterBarcode,
                },
            });

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(AppPage.EnterBarcode);
            });
        });

        // it("Stages all files opened", () => {
        //
        // });
    });
});
