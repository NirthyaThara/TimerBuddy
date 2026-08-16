const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 290,
    height: 360,
    frame: false,
    borderRadius: 20,
    resizable: false,
    icon: path.join(__dirname, "../src/assets/logo.png"),
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

ipcMain.on("window-minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("window-close", () => {
  mainWindow.close();
});

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});