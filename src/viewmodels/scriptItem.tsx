
export default class ScriptItem {
  name: string;
  workDirectory: string;
  command: string;
  fileName: string;
  args: string;

  constructor() {
    this.name = '';
    this.workDirectory = '';
    this.command = '';
    this.fileName = '';
    this.args = '';
  }
}
