import robot from 'robotjs'
import {ipcMain, app} from 'electron';

ipcMain.on('type-shortcut', async (event, arg) => {
  setTimeout(() => {
    for (const key of arg) {
      robot.keyToggle(key, "down")
    }
    for (const key of arg) {
      robot.keyToggle(key, "up")
    }
  }, 50);
})