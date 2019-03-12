import {
    app,
    BrowserWindow,
    ipcMain,
} from "electron";
import * as os from "os";
import * as path from "path";
import * as url from "url";
import { OPEN_CREATE_PLATE_STANDALONE, PLATE_CREATED } from "../shared/constants";

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | undefined;

function createWindow() {
    BrowserWindow.addDevToolsExtension(
        path.join(os.homedir(), ".config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0")
    );
    // Create the browser window.
    win = new BrowserWindow({
        height: 750,
        webPreferences: {
            // Disables same-origin policy and allows us to query Labkey
            webSecurity: false,
        },
        width: 1000,
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        host: "localhost:1212/dist",
        protocol: "http",
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = undefined;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on(OPEN_CREATE_PLATE_STANDALONE, (event: any) => {
    const child: BrowserWindow = new BrowserWindow({
        modal: true,
        parent: win,
        show: false,
        webPreferences: {
            nodeIntegration: false,
        },
    });
    const host = "localhost:8080"; // "stg-aics.corp.alleninstitute.org";
    const modalUrl = `http://${host}/labkey/aics_microscopy/AICS/plateStandalone.view`;
    child.loadURL(modalUrl);
    // todo: use env variable for host
    child.once("ready-to-show", () => {
        child.show();
    });
    child.webContents.on("will-navigate", (e: Event, next: string) => {
        // tslint:disable-next-line
        console.log("will navigate", next);
        if (next.indexOf("plateStandalone.view") === -1) {
            e.preventDefault();
            // todo use constants
            event.sender.send(PLATE_CREATED, "lisa_test");
            child.close();
            // send message to renderer about created plateid/barcode
        }
    });
});
