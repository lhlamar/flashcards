const { app, BrowserWindow, Menu, ipcMain, MenuItem } = require("electron");
const contextMenu = require("electron-context-menu");
const path = require("path");

const LoadCards = require("./LoadCards");

let mainWindow;
let howToUseWindow;
let newFolderWindow;
let folders = LoadCards.getFolders();
let set_data;
let new_set_folder;
let nameSetWindow;
let new_set_name;
let confirmationWindow;
let selectedFolder;
let selectedSet;
let deleteSetConfirmationWindow;

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

      contentSecurityPolicy:
        "script-src 'self' https://cdn.jsdelivr.net/npm/toastify-js",
    },
    minWidth: 520,
    minHeight: 450,
  });

  mainWindow.webContents.openDevTools();

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
  // Attach context menu to mainWindow
}

ipcMain.on("show-context-menu", (event, elementData) => {
  console.log(elementData);
});

ipcMain.on("main", (event, data) => {
  event.returnValue = LoadCards.getFolders(); // send a response for a synchronous request
});

ipcMain.on("secondary", (event, data) => {
  selectedFolder = data;

  event.returnValue = LoadCards.getFolderContents(data);
});

//create new card window
//here data is the folder name that is clicked
//this is sent later to the new set window
//so it can create the set and place it into
//the correct folder
ipcMain.on("open-new-set-window", (event, data) => {
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  new_set_folder = data;
  mainWindow.loadFile(path.join(__dirname, "../renderer/new-set.html"));
});

//when the done button is clicked on the new set page
//a message is sent here containing the new set information
//that will be used here to create a .json file containing
//the user's new set
ipcMain.on("finish-new-set", (event, data) => {
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
  finished_set = data;
  //passing in the name of the folder
  //where the set should go
});

ipcMain.on("get-folder-for-new-set", (event) => {
  event.returnValue = new_set_folder;
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
  set_data = LoadCards.getSetContents(data);

  if (set_data != null) {
    mainWindow.loadFile(path.join(__dirname, "../renderer/study-set.html"));
  } else {
    mainWindow.webContents.send("null-set-error");
  }
});

ipcMain.on("get-set-data", (event) => {
  event.returnValue = set_data;
});

// name set window
ipcMain.on("open-name-set-window", () => {
  nameSetWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 300,
    height: 150,
    resizable: false,
  });

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  nameSetWindow.loadFile(path.join(__dirname, "../renderer/name-set.html"));
});

ipcMain.on("name-set-window-cancel", () => {
  nameSetWindow.close();
});

ipcMain.on("name-set-window-done", (event, data) => {
  new_set_name = data;
  LoadCards.newSet(new_set_folder, new_set_name, finished_set);
  nameSetWindow.close();
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
    width: 300,
    height: 150,
    resizable: false,
  });

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
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
});

ipcMain.on("remove-folder", (event, data) => {
  confirmationWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 300,
    height: 150,
    resizable: false,
  });
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  confirmationWindow.loadFile(
    path.join(__dirname, "../renderer/confirmation.html")
  );
});

//opens confirmation window for when user is trying to delete a new set
ipcMain.on("remove-set", (event, data) => {
  selectedSet = data;
  deleteSetConfirmationWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 300,
    height: 150,
    resizable: false,
  });
  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  deleteSetConfirmationWindow.loadFile(
    path.join(__dirname, "../renderer/delete-set-confirmation.html")
  );
});

ipcMain.on("delete-set-confirmation-window-proceed", (event, data) => {
  LoadCards.removeSet(selectedFolder, selectedSet);
  deleteSetConfirmationWindow.close();
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
});

ipcMain.on("close-delete-set-confirmation-window", (event, data) => {
  deleteSetConfirmationWindow.close();
});

//confirmation window handle proceed
ipcMain.on("confirmation-window-proceed", () => {
  LoadCards.removeFolder(selectedFolder);
  mainWindow.loadFile(path.join(__dirname, "../renderer/home.html"));
});

//closes confirmation window
ipcMain.on("close-confirmation-window", () => {
  confirmationWindow.close();
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
