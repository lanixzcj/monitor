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

const chainTypes = [ 'INPUT', 'FORWARD', 'OUTPUT'];

const ipHeaders = {
    rule: {
        name: '规则链',
        editable: {
            type: 'select',
            options: {values: chainTypes}
        }
    },
    ip: 'IP',
};

const fileHeaders = {
    file : '文件名',
    permission: '权限',
};

const cellEditProp = {
    mode: 'click',
    blurToSave: true
};


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

    componentWillMount() {
        this.props.strategyActions.loadStrategy(this.props.host);
    }

    customFooter = () => {
        return (
            <InsertModalFooter
                saveBtnText="保存"
                closeBtnText="取消"
            />
        )
    };

    customHeader = () => {
        return (
            <InsertModalHeader
                title="添加"
            />
        )
    };

    onAddRow = (row, name) => {
        this.props.strategyActions.addStrategy(name, this.props.host, row)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy(name, this.props.host, row);
    };

    render() {



        const isLoading = this.props.loading;
        const buttonLabel = isLoading ? 'Loading' : '保存';
        const selectRowProp = {
            mode: 'checkbox',
        };
        const extra = {
            insertRow: true,
            deleteRow: true,
            search: true,
            selectRow: selectRowProp,
            remote: true
        };

        const options = {
            insertModalHeader: this.customHeader,
            insertModalFooter: this.customFooter,
        };

        const ipOptions = {...options, onAddRow: (row) => {this.onAddRow(row, 'ip_packet')},
            onDeleteRow: (row) => {this.onDeleteRow(row, 'ip_packet')}};
        const fileOptions = {...options, onAddRow: (row) => {this.onAddRow(row, 'file')},
            onDeleteRow: (row) => {this.onDeleteRow(row, 'file')}};

        const strategy = this.props.strategy ? this.props.strategy : {};
        const device = strategy.device ? strategy.device : {};
        let ip_packets = strategy.ip_packet ? strategy.ip_packet : {};
        // ip_packets = this.props.ipPacket.strategy.length == 0 ? ip_packets : this.props.ipPacket.strategy;

        let files = strategy.files ? strategy.files : {};
        // files = this.props.file.strategy.length == 0 ? files : this.props.file.strategy;

        // console.log(this.props);
        // TODO:raect-bootstrap-table与react-bootstrap的modal不兼容
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
                        {/*<Tab eventKey={3} title="文件">*/}
                        {/*<MonTable options={fileOptions} extra={extra} data={files}*/}
                        {/*headers={ fileHeaders}/>*/}
                        {/*</Tab>*/}
                        {/*<Tab eventKey={5} title="IP包">*/}
                        {/*<MonTable options={ipOptions} extra={extra} data={ip_packets}*/}
                        {/*headers={ ipHeaders}/>*/}
                        {/*</Tab>*/}
                    </Tabs>
                </Modal.Body>
            </div>

        );
    }
}
