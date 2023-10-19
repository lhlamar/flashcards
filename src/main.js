const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Main Window
function createHomeWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      minWidth: 475,
    },
  });
  mainWindow.webContents.openDevTools();

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
}

//create new card window
ipcMain.on("open-new-set-window", () => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/new-set.html"));
});

ipcMain.on("open-home-window", () => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createHomeWindow();
  Menu.setApplicationMenu(null);
  // const mainMenu = Menu.buildFromTemplate(menu);
  // Menu.setApplicationMenu(mainMenu);

  // Remove variable from memory
  mainWindow.on("closed", () => (mainWindow = null));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createHomeWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
