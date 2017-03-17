import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import Slider from '../../components/Slider'
import './Modal.css'
import AlertContainer from 'react-alert';
import MonTable from '../../components/MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'
import DeviceTab from './DeviceStrategyTab'
import FileStrategyTab from './FileStrategyTab'
import IpStrategyTab from './IpStrategyTab'

@connect(
    state => ({
        strategy: state.strategy
    }),
    dispatch => ({
        strategyActions: bindActionCreators(strategyActions, dispatch),
    })
)
export default class MonitorModal extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.strategyActions.loadStrategy(this.props.host);
    }

    render() {

        const strategy = this.props.strategy ? this.props.strategy : {};

        let files = strategy.data.files ? strategy.data.files : [];
        let ip_packet = strategy.data.ip_packet ? strategy.data.ip_packet : [];

        return (
            <div className={ `modal-content react-bs-table-insert-modal`}>
                <div className={ `modal-header react-bs-table-inser-modal-header`}>
                <span>
                    <button type='button'
                            className='close' onClick={ this.props.hideModal }>
                            <span aria-hidden='true'>&times;</span>
                            <span className='sr-only'>Close</span>
                    </button>
                    <h4 className='modal-title'>配置{this.props.host}安全策略</h4>
                </span>
                </div>
                <Modal.Body>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="设备信息">
                            <DeviceTab {...strategy.data.device} host={this.props.host}
                                       changeAction={this.props.strategyActions.changeDeviceStrategy}/>
                        </Tab>
                        <Tab eventKey={3} title="文件">
                            <FileStrategyTab data={files} host={this.props.host}/>
                        </Tab>
                        <Tab eventKey={5} title="IP包">
                            <IpStrategyTab data={ip_packet} host={this.props.host}/>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </div>

        );
    }
}
