import axios, { AxiosError, AxiosResponse } from "axios";
import { expect } from "chai";
import { isEmpty } from "lodash";
import { dirname, resolve } from "path";
import * as sinon from "sinon";
import { SinonStub } from "sinon";

import selections from "../";

import { feedback } from "../../";
import createReduxStore, { reduxLogicDependencies } from "../../configure-store";
import { API_WAIT_TIME_SECONDS } from "../../constants";
import { getAlert, getRequestsInProgressContains } from "../../feedback/selectors";
import { AlertType, AppAlert, HttpRequestType } from "../../feedback/types";
import { createMockReduxStore } from "../../test/configure-mock-store";
import { mockState } from "../../test/mocks";
import { AicsSuccessResponse, HTTP_STATUS } from "../../types";
import { selectBarcode } from "../actions";
import { GENERIC_GET_WELLS_ERROR_MESSAGE, MMS_IS_DOWN_MESSAGE, MMS_MIGHT_BE_DOWN_MESSAGE } from "../logics";
import { UploadFileImpl } from "../models/upload-file";
import { getAppPage, getSelectedBarcode, getSelectedPlateId, getWells } from "../selectors";
import { DragAndDropFileList, Page, UploadFile, Well } from "../types";

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
        expect(file.isDirectory).to.equal(false);
        expect(file.name).to.equal(FILE_NAME);
        expect(file.path).to.equal(resolve(__dirname, TEST_FILES_DIR));
        expect(file.fullPath).to.equal(FILE_FULL_PATH);

        const folder = stagedFiles[EXPECTED_FOLDER_INDEX];
        expect(folder.isDirectory).to.equal(true);
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

        it("Goes to EnterBarcode page if on DragAndDrop page", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.DragAndDrop);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);
                done();
            });
        });

        it("Does not change page if not on DragAndDrop page", (done) => {
            const store = createReduxStore({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    page: Page.EnterBarcode,
                },
            });

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);
                done();
            });
        });

        it("stages all files loaded", (done) => {
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
                done();
            });
        });

        it ("should stop loading on success", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);

            // apply
            store.dispatch(selections.actions.loadFilesFromDragAndDrop(fileList));

            store.subscribe(() => {
                // after
                expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);
                done();
            });
        });

        it ("should stop loading on error", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);

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
                expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);
                done();
            });
        });
    });

    describe("openFilesLogic", () => {
        let filePaths: string[];

        beforeEach(() => {
            filePaths = [FILE_FULL_PATH, FOLDER_FULL_PATH];
        });

        it("Goes to EnterBarcode page if on DragAndDrop page", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.DragAndDrop);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);
                done();
            });
        });

        it("Does not change page if not on DragAndDrop page", (done) => {
            const store = createReduxStore({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    page: Page.EnterBarcode,
                },
            });

            // before
            expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            // after
            store.subscribe(() => {
                expect(selections.selectors.getAppPage(store.getState())).to.equal(Page.EnterBarcode);
                done();
            });
        });

        it("Stages all files opened", (done) => {
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
                done();
            });
        });

        it("Removes child files or directories", (done) => {
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
                expect(stagedFiles[0].isDirectory).to.equal(true);
                expect(stagedFiles[0].path).to.equal(dirname(FOLDER_FULL_PATH));
                expect(stagedFiles[0].name).to.equal(FOLDER_NAME);
                done();
            });
        });

        it ("should stop loading on success", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);

            // apply
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            store.subscribe(() => {
                // after
                expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);
                done();
            });
        });

        it ("should stop loading on error", (done) => {
            const store = createReduxStore(mockState);

            // before
            expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);

            // apply
            filePaths = [resolve(__dirname, TEST_FILES_DIR, "does_not_exist.txt")];
            store.dispatch(selections.actions.openFilesFromDialog(filePaths));

            store.subscribe(() => {
                // after
                expect(feedback.selectors.getIsLoading(store.getState())).to.equal(false);
                done();
            });
        });
    });

    describe("getFilesInFolderLogic", () => {
        it("should add child files to folder", (done) => {
            const folder = new UploadFileImpl(FOLDER_NAME, dirname(FOLDER_FULL_PATH), true);
            const stagedFiles = [
                new UploadFileImpl(FILE_NAME, dirname(FILE_FULL_PATH), false),
                folder,
            ];
            const store = createReduxStore({
                ...mockState,
                selection: {
                    ...mockState.selection,
                    stagedFiles,
                },
            });

            // before
            const stagedFilesBefore = selections.selectors.getStagedFiles(store.getState());
            expect(isEmpty(stagedFilesBefore[EXPECTED_FOLDER_INDEX].files)).to.equal(true);

            // apply
            store.dispatch(selections.actions.getFilesInFolder(folder));

            store.subscribe(() => {
                // after
                const stagedFilesAfter = selections.selectors.getStagedFiles(store.getState());
                const stagedFolder = stagedFilesAfter[EXPECTED_FOLDER_INDEX];
                expect(stagedFolder.files.length).to.equal(2);

                const stagedFolderContainsSecretsFolder = !!stagedFolder.files.find((file) => {
                    return file.name === "secrets" &&
                        file.path === FOLDER_FULL_PATH &&
                        file.isDirectory;
                });
                expect(stagedFolderContainsSecretsFolder).to.equal(true);

                const stagedFolderContainsTxtFile = !!stagedFolder.files.find((file) => {
                    return file.name === "more_cells.txt" &&
                        file.path === FOLDER_FULL_PATH &&
                        !file.isDirectory;
                });
                expect(stagedFolderContainsTxtFile).to.equal(true);
                done();
            });
        });
    });

    describe("selectBarcodeLogic", () => {
        const barcode = "1234";
        const plateId = 1;
        let mockOkResponse: AxiosResponse<AicsSuccessResponse<Well[][]>>;
        let mockBadGatewayResponse: AxiosError;
        const createMockReduxLogicDeps = (getStub: SinonStub) => ({
            ...reduxLogicDependencies,
            httpClient: {
                ...axios,
                get: getStub,
                post: sinon.stub(),
            },
        });

        beforeEach(() => {
            const mockEmptyWell: Well = {
                cellPopulations: [],
                solutions: [],
                viabilityResults: [],
                wellId: 1,
            };
            mockOkResponse = {
                config: {},
                data: {
                    data: [[[mockEmptyWell]]],
                    offset: 0,
                    responseType: "SUCCESS",
                    totalCount: 1,
                },
                headers: {},
                status: HTTP_STATUS.OK,
                statusText: "OK",
            };
            mockBadGatewayResponse = {
                config: {},
                message: "Bad Gateway",
                name: "",
                response: {
                    ...mockOkResponse,
                    data: [],
                    status: HTTP_STATUS.BAD_GATEWAY,
                    statusText: "Bad Gateway",
                },
            };
        });

        it("Adds GET wells request to requests in progress", (done) => {
            const getStub = sinon.stub().resolves(mockOkResponse);
            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));
            expect(getRequestsInProgressContains(store.getState(), HttpRequestType.GET_WELLS)).to.be.false;
            let storeUpdates = 0;
            store.subscribe(() => {
                storeUpdates++;

                if (storeUpdates === 1) {
                    const state = store.getState();
                    expect(getRequestsInProgressContains(state, HttpRequestType.GET_WELLS)).to.be.true;
                    done();
                }
            });

            store.dispatch(selectBarcode(barcode, plateId));
        });

        it ("removes GET wells from requests in progress if GET wells is OK", (done) => {
            const getStub = sinon.stub().callsFake(() => {
                store.subscribe(() => {
                    expect(getRequestsInProgressContains(store.getState(), HttpRequestType.GET_WELLS)).to.be.false;
                    done();
                });
                return Promise.resolve(mockOkResponse);
            });
            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));

            store.dispatch(selectBarcode(barcode, plateId));
        });

        it("Sets wells, page, barcode, and plateId if GET wells is OK", (done) => {
            const getStub = sinon.stub().callsFake(() => {
                // we add the subscription after the first store.dispatch because we're testing
                // the process callback which gets called after the first store update
                store.subscribe(() => {
                    const state = store.getState();
                    expect(getWells(state)).to.not.be.empty;
                    expect(getAppPage(state)).to.equal(Page.AssociateWells);
                    expect(getSelectedBarcode(state)).to.equal(barcode);
                    expect(getSelectedPlateId(state)).to.equal(plateId);
                    done();
                });

                return Promise.resolve(mockOkResponse);
            });
            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));

            store.dispatch(selectBarcode(barcode, plateId));

        });

        it("Does not retry GET wells request if response is non-Bad Gateway error", (done) => {
            const getStub = sinon.stub().callsFake(() => {
                store.subscribe(() => {
                    const state = store.getState();
                    expect(getRequestsInProgressContains(state, HttpRequestType.GET_WELLS)).to.be.false;
                    expect(getStub.callCount).to.equal(1);

                    const alert = getAlert(state);
                    expect(alert).to.not.be.undefined;

                    if (alert) {
                        expect(alert.type).to.equal(AlertType.ERROR);
                        expect(alert.message).to.equal(GENERIC_GET_WELLS_ERROR_MESSAGE(barcode));
                    }

                    done();
                });

                return Promise.reject({
                    ...mockOkResponse,
                    status: HTTP_STATUS.BAD_REQUEST,
                });
            });

            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));
            store.dispatch(selectBarcode(barcode, plateId));
        });

        it("Shows error message if it only receives Bad Gateway error for 20 seconds", function(done) {
            // here we're using a fake clock so that 20 seconds passes more quickly and to give control
            // over to the test in terms of timing.
            this.clock = sinon.useFakeTimers((new Date()).getTime());

            // extends timeout for this test since we're testing a potentially long running process
            const waitTime = API_WAIT_TIME_SECONDS * 1000 + 3000;
            this.timeout(waitTime);

            let secondsPassed = 0;
            const incrementMs = 5000;

            let firstAlert: AppAlert | undefined;

            // increment clock on every get call by 5 seconds
            const getStub = sinon.stub().callsFake(() => {
                this.clock.tick(incrementMs);
                secondsPassed += incrementMs / 1000;

                if (!firstAlert) {
                    firstAlert = getAlert(store.getState());
                }

                return Promise.reject(mockBadGatewayResponse);
            });
            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));

            store.subscribe(() => {
                if (secondsPassed >= API_WAIT_TIME_SECONDS) {
                    const state = store.getState();
                    const currentAlert: AppAlert | undefined = getAlert(state);
                    expect(getStub.callCount).to.be.greaterThan(1);
                    expect(firstAlert).to.not.be.undefined;

                    if (firstAlert) {
                        expect(firstAlert.type).to.equal(AlertType.WARN);
                        expect(firstAlert.message).to.equal(MMS_MIGHT_BE_DOWN_MESSAGE);
                    }

                    expect(currentAlert).to.not.be.undefined;

                    if (currentAlert) {
                        expect(currentAlert.type).to.equal(AlertType.ERROR);
                        expect(currentAlert.message).to.equal(MMS_IS_DOWN_MESSAGE);
                    }

                    done();
                }
            });

            store.dispatch(selectBarcode(barcode, plateId));
        });

        it("Can handle successful response after retrying GET wells request", function(done) {
            this.timeout(API_WAIT_TIME_SECONDS * 1000 + 3000);
            let okResponseReturned = false;
            const getStub = sinon.stub()
                .onFirstCall().rejects(mockBadGatewayResponse)
                .onSecondCall().callsFake(() => {
                    okResponseReturned = true;
                    return Promise.resolve(mockOkResponse);
                });
            const store = createMockReduxStore(mockState, createMockReduxLogicDeps(getStub));
            store.subscribe(() => {
                if (okResponseReturned) {
                    const state = store.getState();
                    expect(getWells(state)).to.not.be.empty;
                    expect(getAppPage(state)).to.equal(Page.AssociateWells);
                    expect(getSelectedBarcode(state)).to.equal(barcode);
                    expect(getSelectedPlateId(state)).to.equal(plateId);
                    okResponseReturned = false; // prevent more calls to done
                    done();
                }
            });
            store.dispatch(selectBarcode(barcode, plateId));
        });
    });
});
