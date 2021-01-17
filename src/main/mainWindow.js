import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
import {ipcMain, IpcChannels, globalShortcut, screen, app, Tray, Menu, remote} from 'electron';
import os from 'os';
import activeWindow from 'electron-active-window';

const isDev = process.env.NODE_ENV === 'development'
const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring
let mainWindow, tray, lastWindow;

function windowExists(window) {
  return window && !window.isDestroyed();
}

function resetMainWindowSize() {
  if (windowExists(mainWindow)) {
      mainWindow.resizable = true;
      mainWindow.setSize(1100, 1080);
      mainWindow.center();
      mainWindow.resizable = false;
  }
}

function hideMainWindow() {
  if (windowExists(mainWindow)) {
    mainWindow.webContents.send('window-hidden', lastWindow);
    setTimeout(() => {
      if (windowExists(mainWindow)) {
        resetMainWindowSize();
        mainWindow.blur();
        mainWindow.hide()
      }
    }, 25);
  }
}

function showMainWindow() {
  if (windowExists(mainWindow)) {
    resetMainWindowSize();
    mainWindow.show();
    mainWindow.focus();
  }
}

function destroyTrayIcon() {
  if (tray !== undefined && !tray.isDestroyed()) {
      tray.destroy();
  }
}


app.whenReady().then(() => {
  const iconPath = process.env.NODE_ENV === 'development' ? "src/resources/96x96.png" : path.join(process.resourcesPath, "app/dist/resources/96x96.png");
  tray = new Tray(iconPath);
  tray.setToolTip('Shortcutty');
  tray.setIgnoreDoubleClickEvents(true)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', click() {
      destroyTrayIcon();
      app.quit();
    } }
  ])

  tray.setContextMenu(contextMenu);

  tray.on('click', function(e){
    toggleWindow()
  });

  mainWindow.on('blur', () => hideMainWindow());
})

function toggleWindow() {
  if (mainWindow.isVisible()) {
      if (mainWindow.isFocused()) {
          // mainWindow.webContents.send('window-hidden', lastWindow);
          hideMainWindow();
          
      } else {
          showMainWindow();
          mainWindow.webContents.send('shortcut-invoked', lastWindow);
      }
  } else {
      showMainWindow();
      mainWindow.webContents.send('shortcut-invoked', lastWindow)
  }
}

const winHandler = new BrowserWinHandler({
  height: 1080,
  width: 1100,
  frame: false,
  transparent: true
})

setInterval(async () => {
  const win = await activeWindow().getActiveWindow();
  if(!remote && win.windowClass != 'electron.exe')  {
    lastWindow = {
      process: win.windowClass,
      pid: win.windowPid,
      name: win.windowName
    }
  }
}, 100)

ipcMain.handle('last-window', async (event, arg) => {
  return lastWindow;
});

function handleShortcut() {
  toggleWindow();
}

winHandler.onCreated(browserWindow => {
  mainWindow = browserWindow;
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  else browserWindow.loadFile(INDEX_PATH)
  mainWindow.setVisibleOnAllWorkspaces(true);
  hideMainWindow();
  globalShortcut.unregisterAll();
  globalShortcut.register(`Alt+Space`, handleShortcut);
})


ipcMain.on('toggle-window', (event, arg) => {
  console.log("Front wants to hide")
  toggleWindow();
})

ipcMain.on('type-shortcut', () => hideMainWindow());

app.on('window-all-closed', () => {
  app.quit()
})

export default winHandler
