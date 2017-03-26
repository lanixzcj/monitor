import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as modalActions from '../../actions/modal';
import Slider from '../../components/Slider'
import '../../styles/components/Modal.css'

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
    }

    render() {
        return (
            <div>

                <ReactModal className='react-bs-insert-modal modal-dialog'
                    isOpen={this.props.modal.visible}
                    contentLabel="Minimal Modal Example"
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.props.modalActions.hideModal}
                >
                    <MonitorContent hideModal={this.props.modalActions.hideModal} host={this.props.modal.host}/>
                </ReactModal>

            </div>


        );
    }
}
