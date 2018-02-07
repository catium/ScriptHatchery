import * as React from 'react';

import { Layout, Menu, message, Icon } from 'antd';
const { Content, Sider } = Layout;

import { ClickParam } from 'antd/lib/menu';

declare const window: any;
const {ipcRenderer} = window.require('electron');

import ScriptItem from './scriptItem';
import ScriptList from './scriptList';
import ScriptDocker from './scriptDocker';
import ScriptAppender from './scriptAppender';

interface ScriptCoverStates {
  menuDisabled: boolean;
  scriptItems: Map<string, ScriptItem>;
  menuSelected: ScriptItem;
}

export default class ScriptCover extends React.Component<{}, ScriptCoverStates> {
 
  constructor() {
    super();
    this.state = {
      menuDisabled: false,
      scriptItems: new Map<string, ScriptItem>(),
      menuSelected: new ScriptItem()
    };
    ipcRenderer.on('configSave', (event: any, arg: any) => {
      let success = arg as boolean;
      if (success) {
        message.success('配置更改成功');
      } else {
        message.error('配置更改失败');
      }
    });

    ipcRenderer.on('configLoad', (event: any, arg: any) => {
      if (arg !== null) {
        let items = arg as ScriptItem[];
        let itemMap = new Map<string, ScriptItem>(
          items.map(
            (elem) => [elem.name, elem] as [string, ScriptItem]
          )
        );
        this.setState({
          scriptItems: itemMap
        });
      } else {
        message.error('配置加载出错,请检查配置文件');
      }
    });

    this.saveConfig = this.saveConfig.bind(this);
    this.loadConfig = this.loadConfig.bind(this);

    this.onSingleMissionLockerChanged = this.onSingleMissionLockerChanged.bind(this);

    this.onScriptSelected = this.onScriptSelected.bind(this);
    this.onScriptCreated = this.onScriptCreated.bind(this);
    this.onScriptModifed = this.onScriptModifed.bind(this);
    this.onScriptDeleted = this.onScriptDeleted.bind(this);
  }

  componentDidMount() {
    this.loadConfig();
  }

  saveConfig() {
    let arg = Array.from(this.state.scriptItems.values());
    ipcRenderer.send('configSave', arg);
  }

  loadConfig() {
    ipcRenderer.send('configLoad');
  }

  onSingleMissionLockerChanged(isLocked: boolean) {
    this.setState({
      menuDisabled: isLocked
    });
  }

  onScriptSelected(scriptName: string) {
    if (scriptName === '') {
      this.setState(
        {menuSelected: new ScriptItem()}
      );  
    } else {
      let item = this.state.scriptItems.get(scriptName);
      if (item === undefined) {
        message.error('处理菜单时发生错误,请联系开发者.');
      } else {
        this.setState(
          {menuSelected: item}
        );
      }
    }

  }

  onScriptCreated(item: ScriptItem) {
    const itemMap = this.state.scriptItems;
    if (itemMap.has(item.name)) {
      message.error('已存在相同配置名:' + item.name);
    } else {
      itemMap.set(item.name, item);
      this.setState({
        scriptItems: itemMap,
        menuSelected: item
      });
      this.saveConfig();
    }

  }

  onScriptModifed(item: ScriptItem) {
    const itemMap = this.state.scriptItems;
    itemMap[item.name] = item;
    this.setState({
      scriptItems: itemMap,
      menuSelected: item
    });
    this.saveConfig();
  }

  onScriptDeleted(itemName: string) {
    const itemMap = this.state.scriptItems;
    itemMap.delete(itemName);
    this.setState({
      scriptItems: itemMap,
      menuSelected: new ScriptItem()
    });
    this.saveConfig();
  }

  render() {
    return (
      <div>
        <Layout>
          <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
            <div className="logo" />
            <ScriptList 
              onScriptSelected={this.onScriptSelected}
              menuDisabled={this.state.menuDisabled}
              menuSelected={this.state.menuSelected.name}
              scriptNames={Array.from(this.state.scriptItems.keys())}
            />
          </Sider>
          <Layout style={{ marginLeft: 200 , height: '100vh' }}>
            <Content style={{ margin: '12px 8px 0', overflow: 'initial' }}>
              <ScriptDocker 
                onSingleMissionLockerChanged={this.onSingleMissionLockerChanged}
                onChainedScriptCreated={this.onScriptCreated}
                onScriptModified={this.onScriptModifed}
                onScriptDeleted={this.onScriptDeleted}
                scriptItem={this.state.menuSelected}
              />
            </Content>
          </Layout>
        </Layout>

      </div>
    );
  }
}
