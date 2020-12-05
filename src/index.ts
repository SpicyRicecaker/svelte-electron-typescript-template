import {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  // dialog,
  // ipcMain,
} from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow = null;
let tray: Tray;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width * 0.85,
    height: height * 0.75,
    icon: app.isPackaged
      ? path.join(process.resourcesPath, 'icon.ico')
      : path.join(path.resolve(), 'pages', 'public', 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1.5,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../pages/public/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // Answer from https://stackoverflow.com/questions/35008347/electron-close-w-x-vs-right-click-dock-and-quit
  let forceQuit = false;
  app.on('before-quit', () => {
    forceQuit = true;
  });

  mainWindow.on('close', (event: Event) => {
    if (!forceQuit) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Code inspired by https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
  const createTray = (): void => {
    const imgPath = app.isPackaged
      ? path.join(process.resourcesPath, 'icon.ico')
      : path.join(path.resolve(), 'pages', 'public', 'assets', 'icon.ico');
    tray = new Tray(imgPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: (): void => {
          mainWindow.show();
        },
      },
      {
        label: 'Quit',
        click: (): void => {
          app.exit();
        },
      },
    ]);
    tray.on('click', () => {
      mainWindow.show();
    });
    tray.setToolTip('Svelte-App');
    tray.setContextMenu(contextMenu);
  };
  createTray();
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // event, commandline, workingdirectory
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      // Can this be optimized??
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      } else if (mainWindow.isMinimized()) {
        mainWindow.restore();
        mainWindow.focus();
      } else {
        mainWindow.focus();
      }
    }
  });

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', createWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// IPC Handles

// ipcMain.handle('showSaveDialog', async (event, options) =>
//   //do something with args
//   dialog.showSaveDialog(options)
// );

// ipcMain.handle('showOpenDialog', async (event, options) =>
//   //do something with args
//   dialog.showOpenDialog(options)
// );
