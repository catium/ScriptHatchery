import * as React from 'react';

import { Form, Input, Row, Col, Collapse, Button, message, Popconfirm, Alert, Divider, notification } from 'antd';
const Panel = Collapse.Panel;

import ScriptItem from './scriptItem';
import ScriptDetail from './scriptDetail';
import ScriptAppender from './scriptAppender';

import ScriptWorker, { CloseResult } from '../workers/scriptWorker';

interface ScriptDockerProps {
  onSingleMissionLockerChanged: (isLocked: boolean) => void;

  onChainedScriptCreated: (item: ScriptItem) => void;
  onScriptModified: (item: ScriptItem) => void;
  onScriptDeleted: (itemName: string) => void;
  scriptItem: ScriptItem;
}

interface ScriptDockerStates {
  consoleOut: string;
  isRunningDisabled: boolean;
}

export default class ScriptDocker extends React.Component<ScriptDockerProps, ScriptDockerStates> {
  worker: ScriptWorker;
  detail: ScriptDetail | null;

  constructor(p: ScriptDockerProps) {

    super(p);
    this.state = {
      consoleOut: '',
      isRunningDisabled: false
    };

    this.onButtonRun = this.onButtonRun.bind(this);
    this.onButtonModify = this.onButtonModify.bind(this);
    this.onButtonDelete = this.onButtonDelete.bind(this);
    this.onButtonClearConsole = this.onButtonClearConsole.bind(this);
    this.onScriptWorkerData = this.onScriptWorkerData.bind(this);
    this.onScriptWorkerClose = this.onScriptWorkerClose.bind(this);
    this.onScriptWorkerError = this.onScriptWorkerError.bind(this);
    this.worker = new ScriptWorker({
      onData: this.onScriptWorkerData,
      onClose: this.onScriptWorkerClose,
      onError: this.onScriptWorkerError
    });

    this.viewChangesByScriptRunning = this.viewChangesByScriptRunning.bind(this);
    this.isDockerHide = this.isDockerHide.bind(this);
  }

  onButtonRun() {
    if (this.detail === null) {
      message.error('错误的引用');
    } else {
      this.viewChangesByScriptRunning(true);
      let type = 'info';
      notification[type]({
        message: '开始',
        description: '脚本正在执行...'
      });
      this.worker.spawn(this.detail.state.scriptItem);
    }
  }

  onButtonModify() {
    if (this.detail === null) {
      message.error('错误的引用');
    } else {
      this.props.onScriptModified(this.detail.state.scriptItem);
    }
  }

  onButtonDelete() {
    if (this.detail === null) {
      message.error('错误的引用');
    } else {
      this.props.onScriptDeleted(this.detail.state.scriptItem.name);
    }
  }

  onButtonClearConsole() {
    this.setState({
      consoleOut: ''
    });
  }

  onScriptWorkerError(error: string) {
    this.viewChangesByScriptRunning(false);
    let type = 'error';
    notification[type]({
      message: '出错',
      description: '脚本执行出错:' + error
    });
  }

  onScriptWorkerData(content: string) {
    this.setState({consoleOut: this.state.consoleOut + content + '\n'});
  }

  onScriptWorkerClose(result: CloseResult) {
    this.viewChangesByScriptRunning(false);
    let type: string;
    let description: string;
    if (result.code === 0) {
      type = 'success';
      description = '脚本执行完成';
    } else {
      type = 'warning';
      description = '脚本执行完成,可能存在问题,代码:' + result.code;
    }
    notification[type]({
      message: '完成',
      description: description
    });
  }

  viewChangesByScriptRunning(isRunning: boolean) {
    let activePages: string[];
    this.setState({
      isRunningDisabled: isRunning
    });
    this.props.onSingleMissionLockerChanged(isRunning);
  }

  isDockerHide() {
    if (this.props.scriptItem.name === '') {
      return {};
    } else {
      return {display: 'none'};
    }
  }

  render() {
    if (this.props.scriptItem.name === '') {
      return (
        <div>
          <Alert
            message="开始使用"
            description="请从左侧列表中选择一个脚本配置."
            type="success"
            showIcon={true}
          />
          <Divider>或者</Divider>
          <ScriptAppender 
            onScriptCreated={this.props.onChainedScriptCreated}
          />
        </div>
      );
    } else {
      return (
        <Collapse bordered={false} defaultActiveKey={['1', '2']}>
        <Panel header="脚本配置详情" key="1">
          <ScriptDetail 
            ref={(ref) => this.detail = ref}
            isNameDisabled={true}
            scriptItem={this.props.scriptItem}
          />    
        <Button type="primary" onClick={this.onButtonRun} disabled={this.state.isRunningDisabled}>运行脚本</Button>
        &nbsp;
        <Button onClick={this.onButtonModify} disabled={this.state.isRunningDisabled}>保存修改</Button>
        &nbsp;
        <Button onClick={this.onButtonClearConsole} disabled={this.state.isRunningDisabled}>清除输出</Button>
        <span style={{float: 'right'}}>
          <Popconfirm placement="left" title="确认删除?" onConfirm={this.onButtonDelete} okText="确认" cancelText="取消">
            <Button type="danger" disabled={this.state.isRunningDisabled}>删除配置</Button>
          </Popconfirm>
        </span>
        </Panel>
        
        <Panel header="运行结果" key="2">  
          <div style={{ padding: 24, background: '#fff', textAlign: 'left', whiteSpace: 'pre-line'}}>
            {this.state.consoleOut}
          </div>
        </Panel>
        </Collapse>
      );
    }
  }
}