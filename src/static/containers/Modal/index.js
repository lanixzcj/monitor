import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as modalActions from '../../actions/modal';

import MonitorContent from './ModalContent'
import { Modal, Tabs } from 'antd';

@connect(
    state => ({
        modal: state.modal,
    }),
    dispatch => ({
        modalActions: bindActionCreators(modalActions, dispatch),
    })
)
export default class MonitorModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <Modal
                    visible={this.props.modal.visible}
                    title={`配置${this.props.modal.host}安全策略`}
                    onCancel={this.props.modalActions.hideModal}
                    footer={null}
                    afterClose={this.unmountContent}
                >
                    {!this.props.modal.visible ? <div></div> :
                        <MonitorContent host={this.props.modal.host}/>}
                </Modal>

            </div>


        );
    }
}
