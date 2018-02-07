import * as React from 'react';
declare const window: any;
const {ipcRenderer} = window.require('electron');

import ScriptItem from '../viewmodels/scriptItem';

interface BaseWorkerProps {
  onError: (error: string) => void;
  onData: (content: string) => void;
  onClose: (result: CloseResult) => void;
}

export interface CloseResult {
  code: number;
  signal: string;
}

export default class ScriptWorker extends React.Component<BaseWorkerProps, {}> {

  constructor(p: BaseWorkerProps) {
    super(p);

    ipcRenderer.on('scriptData', (event: any, arg: any) => {
      p.onData(arg as string);
    });

    ipcRenderer.on('scriptClose', (event: any, arg: any) => {
      //arg as CloseParamerter
      p.onClose(arg as CloseResult);
    });
    
    ipcRenderer.on('scriptError', (event: any, arg: any) => {
      p.onError(arg as string);
    });
  }

  spawn(scriptItem: ScriptItem) {
    let argsSplited = scriptItem.args.match(/\w+|"[^"]+"/g);
    if (argsSplited === null) {
      argsSplited = [];
    }
    let resolvedArgs = {
      workDirectory: scriptItem.workDirectory,
      command: scriptItem.command,
      fileName: scriptItem.fileName,
      args: argsSplited
    };
    ipcRenderer.send('scriptRun', resolvedArgs);
  }
}
