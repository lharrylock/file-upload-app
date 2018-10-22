import {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItemConstructorOptions,
} from "electron";
import * as url from "url";

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | undefined;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600});

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

ipcMain.on("OPEN_CREATE_PLATE", (event) => {
   console.log(event);
   const child = new BrowserWindow({
       modal: true,
       parent: win,
       show: false,
       webPreferences: {
           devTools: true,
           nodeIntegration: false,
       },
   });
   const modalUrl = // "https://github.com";
   "http://stg-aics.corp.alleninstitute.org/labkey/aics_microscopy/AICS/createPlate.view?";
   child.loadURL(modalUrl);
   // todo: use env variable for host
   child.once("ready-to-show", () => {
       child.show();
   });
   child.webContents.on("will-navigate", (e: Event, next: string) => {
       // e.preventDefault();
       console.log("will navigate", next);
       if (next.indexOf("/labkey/aics_microscopy/AICS/platesWells.view") > -1) {
           e.preventDefault();
           console.log("Plate created");
       }
   });
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Menu
// const template: MenuItemConstructorOptions[] = [
//     {
//         label: "File",
//         submenu: [
//             {
//                 label: "Clear all staged files",
//                 click(menuItem, window, event) {
//                     console.log("clear called");
//                     event.sender.send("CLEAR_STAGED_FILES", null);
//                 },
//             },
//             {
//                 role: "quit",
//             },
//         ],
//     },
// ];
//
// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);
