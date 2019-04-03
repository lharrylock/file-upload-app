import { app, BrowserWindow, Event, ipcMain } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import { LIMS_HOST, LIMS_PORT, UPLOAD_FAILED } from "../shared/constants";
import { START_UPLOAD, UPLOAD_FINISHED } from "../shared/constants";
import FileStoreServiceClient from "./file-storage-service-client";
import { Uploads } from "./file-storage-service-client/types";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

function createMainWindow() {
    const window = new BrowserWindow({
        height: 750,
        webPreferences: {
            // Disables same-origin policy and allows us to query Labkey
            webSecurity: false,
        },
        width: 1000,
    });

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true,
        }));
    }

    window.on("closed", () => {
        mainWindow = undefined;
    });

    window.webContents.on("devtools-opened", () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
    mainWindow = createMainWindow();
});

const startUpload = async (event: Event, uploads: Uploads) => {
    // tslint:disable-next-line
    console.log("received start upload request from renderer");
    const uploadClient = new FileStoreServiceClient(LIMS_HOST, LIMS_PORT);
    try {
        const result = await uploadClient.uploadFiles(uploads);
        event.sender.send(UPLOAD_FINISHED, result);
    } catch (e) {
        event.sender.send(UPLOAD_FAILED, e);
    }
};

ipcMain.on(START_UPLOAD, startUpload);
