const path = require('path')

class NativeContext {
  
  constructor() {
    this.browserWindowConstructorOptions = {
      width: 1200, 
      height: 800
    }

    this.workDirectoryPlaceHolder = '%'
    this.workDirectory = ''
    this.loadFromPackage = false
    this.packageIndex = "./build/index.html"
    this.developServerIndex = "http://localhost:3000/"

    this.devTools = true

    this.electronDirectory = this.electronDirectory.bind(this)
  }
 
  electronDirectory() {
    if(this.loadFromPackage) {
      return path.join(this.workDirectory, '..', '..')
    } else {
      return this.workDirectory
    }
  }
}
NativeContext.instance = null
NativeContext.getInstance = function(){
  if(this.instance === null){
      this.instance = new NativeContext();
  }
  return this.instance;
}

module.exports = NativeContext.getInstance()
