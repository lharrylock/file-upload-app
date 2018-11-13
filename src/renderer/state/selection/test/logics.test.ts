import { expect } from "chai";
import { dirname, resolve } from "path";

import createReduxStore from "../../configure-store";
import { isLoading } from "../../index";
import { mockState } from "../../test/mocks";

import selections from "../";
import { AppPage, DragAndDropFileList, UploadFile } from "../types";

describe("Selection logics", () => {
    const FILE_NAME = "cells.txt";
    const TEST_FILES_DIR = "files";
    const FOLDER_NAME = "a_directory";
    const FILE_FULL_PATH = resolve(__dirname, TEST_FILES_DIR, FILE_NAME);
    const FOLDER_FULL_PATH = resolve(__dirname, TEST_FILES_DIR, FOLDER_NAME);
    const EXPECTED_FILE_INDEX = 0;
    const EXPECTED_FOLDER_INDEX = 1;

    const testStagedFilesCreated = (stagedFiles: UploadFile[]) => {
        const file = stagedFiles[EXPECTED_FILE_INDEX];
        expect(file.getIsDirectory()).to.equal(false);
        expect(file.name).to.equal(FILE_NAME);
        expect(file.path).to.equal(resolve(__dirname, TEST_FILES_DIR));
        expect(file.fullPath).to.equal(FILE_FULL_PATH);

        const folder = stagedFiles[EXPECTED_FOLDER_INDEX];
        expect(folder.getIsDirectory()).to.equal(true);
        expect(folder.name).to.equal(FOLDER_NAME);
        expect(folder.path).to.equal(resolve(__dirname, TEST_FILES_DIR));
        expect(folder.fullPath).to.equal(FOLDER_FULL_PATH);
    };

    describe("loadFilesLogic", () => {
        let fileList: DragAndDropFileList;

        beforeEach(() => {
            // a FileList (https://developer.mozilla.org/en-US/docs/Web/API/FileList) does not have a constructor
            // and must implement some iterator methods. For the purposes of keeping these tests simple, we're casting
            // it twice to make the transpiler happy.
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
            };
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

                testStagedFilesCreated(stagedFiles);
            });
        });

        it ("should stop loading on success", () => {
            const store = createReduxStore(mockState);

            // before
            expect(isLoading.selectors.getValue(store.getState())).to.equal(false);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            store.subscribe(() => {
                // after
                expect(isLoading.selectors.getValue(store.getState())).to.equal(false);
            });
        });

        it ("should stop loading on error", () => {
            const store = createReduxStore(mockState);

            // before
            expect(isLoading.selectors.getValue(store.getState())).to.equal(false);

            // apply
            fileList = {
                length: 2,
                0: {
                    name: "does_not_exist.txt",
                    path: FILE_FULL_PATH,
                },
                1: {
                    name: FOLDER_NAME,
                    path: FOLDER_FULL_PATH,
                },
            };
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            store.subscribe(() => {
                // after
                expect(isLoading.selectors.getValue(store.getState())).to.equal(false);
            });
        });
    });

    describe("openFilesLogic", () => {
        let filePaths: string[];

        beforeEach(() => {
            filePaths = [FILE_FULL_PATH, FOLDER_FULL_PATH];
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

        it("Stages all files opened", () => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getStagedFiles(store.getState()).length).to.equal(0);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            store.subscribe(() => {
                // after
                const stagedFiles = selections.selectors.getStagedFiles(store.getState());
                expect(stagedFiles.length).to.equal(filePaths.length);

                testStagedFilesCreated(stagedFiles);
            });
        });

        it("Removes child files or directories", () => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getStagedFiles(store.getState()).length).to.equal(0);

            // apply
            const filePathsWithDuplicates = [
                resolve(FOLDER_FULL_PATH, "test.txt"),
                FOLDER_FULL_PATH,
                resolve(FOLDER_FULL_PATH, "test2.txt"),
            ];
            store.dispatch(selections.actions.openFilesFromDialog(filePathsWithDuplicates));

            store.subscribe(() => {
                // after
                const stagedFiles = selections.selectors.getStagedFiles(store.getState());
                expect(stagedFiles.length).to.equal(1);
                expect(stagedFiles[0].getIsDirectory()).to.equal(true);
                expect(stagedFiles[0].path).to.equal(dirname(FOLDER_FULL_PATH));
                expect(stagedFiles[0].name).to.equal(FOLDER_NAME);
            });
        });

        it ("should stop loading on success", () => {
            const store = createReduxStore(mockState);

            // before
            expect(isLoading.selectors.getValue(store.getState())).to.equal(false);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            store.subscribe(() => {
                // after
                expect(isLoading.selectors.getValue(store.getState())).to.equal(false);
            });
        });

        it ("should stop loading on error", () => {
            const store = createReduxStore(mockState);

            // before
            expect(isLoading.selectors.getValue(store.getState())).to.equal(false);

            // apply
            filePaths = [resolve(__dirname, TEST_FILES_DIR, "does_not_exist.txt")];
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            store.subscribe(() => {
                // after
                expect(isLoading.selectors.getValue(store.getState())).to.equal(false);
            });
        });
    });
});
