const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

const LoadCards = require("./LoadCards");

let mainWindow;
let howToUseWindow;
let newFolderWindow;
let folders = LoadCards.getFolders();
let set_data;

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
    },
    minWidth: 520,
    minHeight: 450,
  });
  
  mainWindow.webContents.openDevTools();

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
}

ipcMain.on("main", (event, data) => {
  console.log(data); // show the request data
  event.returnValue = LoadCards.getFolders(); // send a response for a synchronous request
});

ipcMain.on("secondary", (event, data) => {
  console.log(data); // show the request data

  event.returnValue = LoadCards.getFolderContents(data);
});

//create new card window
ipcMain.on("open-new-set-window", () => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);

  mainWindow.loadFile(path.join(__dirname, "../renderer/new-set.html"));
});

//reloads the main window
ipcMain.on("open-home-window", () => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
});

//loads the study set window and gets the info from
//the study set
ipcMain.on("open-study-set-window", (event, data) => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/study-set.html"));

  LoadCards.getSetContents(data, (error, jsonData) => {
    if (error) {
      // Handle the error
    } else {
      // Work with the jsonData here
      set_data = jsonData;
    }
  });
});

ipcMain.on("get-set-data", (event) => {
  event.returnValue = set_data;
});

// How To Use Window
ipcMain.on("open-how-to-use-window", () => {
  howToUseWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      minWidth: 475,
    },
  });

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  howToUseWindow.loadFile(path.join(__dirname, "../renderer/how-to-use.html"));
});

// new folder Window
ipcMain.on("open-new-folder-window", () => {
  newFolderWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      
    },
    width: 600,
    height: 600,
    resizable: false,
  });
 newFolderWindow.webContents.openDevTools();
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  newFolderWindow.loadFile(path.join(__dirname, "../renderer/new-folder.html"));
});

//closed new folder window
ipcMain.on("close-new-folder-window", () => {
  newFolderWindow.close();
});

//creates new folder based on the data input
ipcMain.on("new-folder-request", (event, data) => {
  LoadCards.newFolder(data);
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
