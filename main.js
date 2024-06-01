const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

const isDev = process.env.NODE_ENV !== "development";
const isMac = process.platform === "darwin";

let mainWindow;

const createMainWindow = (page = "index.html") => {
  mainWindow = new BrowserWindow({
    title: "Aplikasi Manajemen Keuangan UKM",
    width: isDev ? 1000 : 500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/js/main.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, `./renderer/${page}`));
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

ipcMain.on("navigate", (event, page) => {
  mainWindow.loadFile(path.join(__dirname, `./renderer/${page}`));
});
