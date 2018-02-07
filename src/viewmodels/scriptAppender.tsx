import * as React from 'react';
import { Modal, Form, Input, Row, Col, Button, message, Alert } from 'antd';

import ScriptItem from './scriptItem';
import ScriptDetail from './scriptDetail';

interface ScriptAppenderProps {
  onScriptCreated: (item: ScriptItem) => void;
}

interface ScriptAppenderStates {
  isModalVisible: boolean;
}

export default class ScriptAppender extends React.Component<ScriptAppenderProps, ScriptAppenderStates> {
  detail: ScriptDetail | null;

  constructor(p: ScriptAppenderProps) {
    super(p);
    this.state = {
      isModalVisible: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onScriptAdd = this.onScriptAdd.bind(this);
  }

  showModal() {
    this.setState({
      isModalVisible: true
    });
  }

  hideModal() {
    this.setState({
      isModalVisible: false
    });
  }

  onScriptAdd() {
    this.hideModal();
    if (this.detail === null) {
      message.error('错误的引用');
    } else {
      this.props.onScriptCreated(this.detail.state.scriptItem);
    }
  }

  render() {
    return (
      <div>
        <span style={{float: 'right'}}>
          <Button type="primary" size="large" icon="file-add" onClick={this.showModal}>创建新配置</Button>

        </span>
        <Modal
          title="新增配置"
          wrapClassName="vertical-center-modal"
          visible={this.state.isModalVisible}
          onOk={() => this.onScriptAdd()}
          onCancel={() => this.hideModal()}
        >
          <ScriptDetail 
            ref={(ref) => this.detail = ref}
            isNameDisabled={false}
            scriptItem={new ScriptItem()}
          />   
        </Modal>
      </div>
    );
  }
}