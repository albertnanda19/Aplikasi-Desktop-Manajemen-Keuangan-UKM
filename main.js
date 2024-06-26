require("dotenv").config();
const Chart = require("chart.js");

const path = require("path");
const { app, BrowserWindow } = require("electron");

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Aplikasi Manajemen Keuangan UKM",
    width: isDev ? 1000 : 500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/js/main.js"),
      contextIsolation: false,
      enableRemoteModule: false,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
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
