const settings = require('electron-settings');
const path = require('path')
const nativeContext = require('./nativeContext')

class AppConfiguration {
  
  constructor() {
    let filePath = path.join(nativeContext.electronDirectory(), 'config', 'appConfig.json')
    settings.setPath(filePath);
    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.delete = this.delete.bind(this)
  }

  save(key, value) {
    settings.set(key, value)
  }

  load(key) {
    return settings.get(key)
  }

  delete(key) {
    settings.delete(key)
  }

  register(electron, mainWindow) {
    
    let ipcMain = electron.ipcMain
    ipcMain.on('configSave', (event , arg) => {
      this.save('scripts', arg)
      mainWindow.webContents.send('configSave', true)
    });

    ipcMain.on('configLoad', (event , arg) => {
      let configArgs = this.load('scripts')
      mainWindow.webContents.send('configLoad', configArgs)
    });
  }
}

module.exports = AppConfiguration