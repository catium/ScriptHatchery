import * as React from 'react';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

import ScriptItem from './scriptItem';

interface ScriptDetailProps {
  isNameDisabled: boolean;
  scriptItem: ScriptItem;
}

interface ScriptDetailStates {
  scriptItem: ScriptItem;
}

export default class ScriptDetail extends React.Component<ScriptDetailProps, ScriptDetailStates> {
  constructor(p: ScriptDetailProps) {
    super(p);
    this.state = {
      scriptItem: p.scriptItem
    };

    this.handleScriptDetailChange = this.handleScriptDetailChange.bind(this);
  }

  handleScriptDetailChange(key: string, value: string) {
    const scriptItem = this.state.scriptItem;
    scriptItem[key] = value;
    this.setState({
      scriptItem: scriptItem
    });
  }

  componentWillReceiveProps(p: ScriptDetailProps) {
    this.setState({
      scriptItem: p.scriptItem
    });
  }

  render() {
    return (
      <Form layout="vertical">
        <Row><Col span={24}>
          <FormItem>
            <Input 
              onChange={event => 
                this.handleScriptDetailChange(
                  'name',
                  (event.target as HTMLInputElement).value)
              }
              disabled={this.props.isNameDisabled}
              addonBefore="配置名称" 
              value={this.state.scriptItem.name} 
            />
          </FormItem>
          </Col></Row>
        <Row><Col span={24}>
          <FormItem extra="使用百分号(%)代替工具箱程序当前所在目录.">
            <Input 
              onChange={event => 
                this.handleScriptDetailChange(
                  'workDirectory',
                  (event.target as HTMLInputElement).value)
              }
              addonBefore="工作目录" 
              value={this.state.scriptItem.workDirectory} 
            />
          </FormItem>
        </Col></Row>
        <Row><Col span={24}>
          <FormItem extra="如python,perl等,若为操作系统的命令行脚本请留空.">
            <Input 
              onChange={event => 
                this.handleScriptDetailChange(
                  'command',
                  (event.target as HTMLInputElement).value)
              }
              addonBefore="执行命令" 
              value={this.state.scriptItem.command} 
            />
          </FormItem>
        </Col></Row>
        <Row><Col span={24}>
          <FormItem>
            <Input 
              onChange={event => 
                this.handleScriptDetailChange(
                  'fileName',
                  (event.target as HTMLInputElement).value)
              }
              addonBefore="脚本文件" 
              value={this.state.scriptItem.fileName} 
            />
          </FormItem>
        </Col></Row>
        <Row><Col span={24}>
          <FormItem>
            <Input 
              onChange={event => 
                this.handleScriptDetailChange(
                  'args',
                  (event.target as HTMLInputElement).value)
              }
              addonBefore="额外参数" 
              value={this.state.scriptItem.args} 
            />
          </FormItem>
        </Col></Row>
      </Form>
    );
  }
}
