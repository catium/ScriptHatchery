import * as React from 'react';

import { message, Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import ScriptItem from './scriptItem';

interface ScriptListProps {
  onScriptSelected: (scriptName: string) => void;
  menuDisabled: boolean;
  scriptNames: string[];
  menuSelected: string;
}

interface ScriptListStates {
  menuDisabled: boolean;
  scriptNames: string[];
  menuSelected: string;
}

export default class ScriptList extends React.Component<ScriptListProps, ScriptListStates> {
  indexItemKey = '%';

  constructor(p: ScriptListProps) {
    super(p);
    this.state = {
      menuDisabled: p.menuDisabled,
      scriptNames: p.scriptNames,
      menuSelected: (p.menuSelected === '') ? '%' : p.menuSelected
    };

    this.renderItem = this.renderItem.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentWillReceiveProps(p: ScriptListProps) {
    this.setState({
      menuDisabled: p.menuDisabled,
      scriptNames: p.scriptNames,
      menuSelected:  (p.menuSelected === '') ? '%' : p.menuSelected
    });
  }

  handleMenuClick = (e: ClickParam) => {
    if (e.key === this.indexItemKey) {
      //对首页的特殊处理
      this.props.onScriptSelected('');
    } else {
      this.props.onScriptSelected(e.key);
    }
  }

  renderItem(itemName: string) {
    return (
      <Menu.Item key={itemName} disabled={this.state.menuDisabled}>
        <Icon type="setting" />
        <span className="nav-text">{itemName}</span>
      </Menu.Item>
    );
  }

  render() {
    let items = this.state.scriptNames.map(
      (key) => this.renderItem(key)
    );
    return (
      <Menu 
        theme="dark" 
        onClick={this.handleMenuClick} 
        mode="inline" 
        selectedKeys={[this.state.menuSelected]}
      >
        {items}
          <Menu.Item key={this.indexItemKey} disabled={this.state.menuDisabled}>
          <Icon type="file-add" />
          <span className="nav-text">创建新配置</span>
        </Menu.Item>
      </Menu>
    );
  }
}