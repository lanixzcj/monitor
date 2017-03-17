import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as modalActions from '../../actions/modal';
import Slider from '../../components/Slider'
import './Modal.css'
import AlertContainer from 'react-alert';
import MonTable from '../../components/MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'
import DeviceTab from './DeviceStrategyTab'
import MonitorContent from './ModalContent'

@connect(
    state => ({
        modal: state.modal
    }),
    dispatch => ({
        modalActions: bindActionCreators(modalActions, dispatch),
    })
)
export default class MonitorModal extends Component {
    constructor(props) {
        super(props);

        this.alertOptions = {
            offset: 14,
            position: 'bottom right',
            theme: 'dark',
            time: 5000,
            transition: 'scale'
        };

        this.showAlert = (result) => {
            result ? this.msg.show('保存成功', {
                    time: 2000,
                    type: 'success',
                }) : this.msg.show('保存失败', {
                    time: 2000,
                    type: 'error',
                })
        }

    }

    render() {
        return (
            <div>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                <ReactModal className='react-bs-insert-modal modal-dialog'
                    isOpen={this.props.modal.visible}
                    contentLabel="Minimal Modal Example"
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.props.modalActions.hideModal}
                >
                    <MonitorContent host={this.props.modal.host}/>
                </ReactModal>

            </div>


        );
    }
}
