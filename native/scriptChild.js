const path = require('path')
const childProcess = require('child_process')
const nativeContext = require('./nativeContext')

class ScriptChild {
  constructor() {
    this.register = this.register.bind(this)
  }

  register(electron, mainWindow) {
    let ipcMain = electron.ipcMain
    ipcMain.on('scriptRun', (event , arg) => {
      let workDirectory = arg.workDirectory
      workDirectory = workDirectory.replace(nativeContext.workDirectoryPlaceHolder, nativeContext.electronDirectory)
      let command = arg.command
      let fileName = arg.fileName
      let args = arg.args

      

      let process
      if (command !== '') {
        let spawnArgsList = [fileName].concat(args)
        process = childProcess.spawn(command, spawnArgsList, {cwd: workDirectory});
      } else {
        process = childProcess.spawn(fileName, args, {cwd: workDirectory});
      }
      
      process.stdout.setEncoding('utf8');
      process.stdout.on('data', (data) => mainWindow.webContents.send('scriptData', data))
      process.stderr.setEncoding('utf8');
      process.stderr.on('data', (data) => mainWindow.webContents.send('scriptData', data))

      process.on('close', (code, signal) => mainWindow.webContents.send('scriptClose', {code: code, signal: signal}))
      process.on('error', (data) => mainWindow.webContents.send('scriptError', data.message))

    });
  }

}

module.exports = ScriptChild 