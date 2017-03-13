import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {createForm} from 'redux-form-utils';
import formConfig from './Modal.config';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {strategyActions} from '../../views/Modal/ModalRedux';
import Slider from './Slider'
import './Modal.css'
import AlertContainer from 'react-alert';
import MonTable from './MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'

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
        ipPacket: state.modal.ipPacket,
        file: state.modal.file,
    }),
    dispatch => ({
        strategyActions: bindActionCreators(strategyActions, dispatch),
    })
)
// @createForm(formConfig)
export default class ArticleModal extends Component {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.saved) {
            this.showAlert(nextProps.result);
        }
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

        const saveThreshold = () => {
            let threshold = {
                bytes_in: this.byteinSlider.state.value,
                bytes_out: this.byteoutSlider.state.value,
                cpu_used: this.cpuSlider.state.value,
                disk_used: this.diskSlider.state.value,
                mem_used: this.memSlider.state.value,
            };
            this.props.changeDeviceStrategy(this.props.host, threshold);
        };


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
        ip_packets = this.props.ipPacket.strategy.length == 0 ? ip_packets : this.props.ipPacket.strategy;

        let files = strategy.files ? strategy.files : {};
        files = this.props.file.strategy.length == 0 ? files : this.props.file.strategy;

        // TODO:raect-bootstrap-table与react-bootstrap的modal不兼容
        return (
            <div>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                <ReactModal className='react-bs-insert-modal modal-dialog'
                    isOpen={this.props.visible}
                    contentLabel="Minimal Modal Example"
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.props.hideModal}
                >
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
                                <ListGroupItem><strong>硬盘监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                                            min={0} max={device.disk_total}
                                            step={1} defaultValue={device.disk_used} units="GB"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                                            min={0} max={100} step={1}
                                            defaultValue={device.cpu_used} units="%"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                                            min={0} max={device.mem_total} step={1}
                                            defaultValue={device.mem_used} units="KB"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                                            min={0} max={device.bytes_in_max} step={1}
                                            defaultValue={device.bytes_in} units="KB"/>
                                    <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                                            min={0} max={device.bytes_out_max} step={1}
                                            defaultValue={device.bytes_out} units="KB"/>
                                </ListGroupItem>
                                <Modal.Footer>
                                    <Button bsStyle="primary" onClick={saveThreshold} >保存</Button>
                                </Modal.Footer>
                            </Tab>
                            <Tab eventKey={3} title="文件">
                                <MonTable options={fileOptions} extra={extra} data={files}
                                          headers={ fileHeaders}/>
                            </Tab>
                            <Tab eventKey={5} title="IP包">
                                <MonTable options={ipOptions} extra={extra} data={ip_packets}
                                          headers={ ipHeaders}/>
                            </Tab>
                        </Tabs>
                        </Modal.Body>
                    </div>
                </ReactModal>



                {/*<Modal show={this.props.visible} onHide={this.props.hideModal}>*/}
                    {/*<Modal.Header closeButton>*/}
                        {/*<Modal.Title>配置{this.props.host}安全策略</Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    {/*<Modal.Body>*/}
                        {/*<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">*/}
                        {/**/}
                            {/*<Tab eventKey={1} title="设备信息">*/}
                                {/*<ListGroupItem><strong>硬盘监控</strong></ListGroupItem>*/}
                                {/*<ListGroupItem >*/}
                                    {/*<Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"*/}
                                            {/*min={0} max={this.props.deviceStrategy.disk_total}*/}
                                            {/*step={1} defaultValue={this.props.deviceStrategy.disk_used} units="GB"/>*/}
                                {/*</ListGroupItem>*/}
                                {/*<ListGroupItem><strong>CPU监控</strong></ListGroupItem>*/}
                                {/*<ListGroupItem >*/}
                                    {/*<Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"*/}
                                            {/*min={0} max={100} step={1}*/}
                                            {/*defaultValue={this.props.deviceStrategy.cpu_used} units="%"/>*/}
                                {/*</ListGroupItem>*/}
                                {/*<ListGroupItem><strong>内存监控</strong></ListGroupItem>*/}
                                {/*<ListGroupItem >*/}
                                    {/*<Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"*/}
                                            {/*min={0} max={this.props.deviceStrategy.mem_total} step={1}*/}
                                            {/*defaultValue={this.props.deviceStrategy.mem_used} units="KB"/>*/}
                                {/*</ListGroupItem>*/}
                                {/*<ListGroupItem><strong>网络监控</strong></ListGroupItem>*/}
                                {/*<ListGroupItem >*/}
                                    {/*<Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"*/}
                                            {/*min={0} max={this.props.deviceStrategy.bytes_in_max} step={1}*/}
                                            {/*defaultValue={this.props.deviceStrategy.bytes_in} units="KB"/>*/}
                                    {/*<Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"*/}
                                            {/*min={0} max={this.props.deviceStrategy.bytes_out_max} step={1}*/}
                                            {/*defaultValue={this.props.deviceStrategy.bytes_out} units="KB"/>*/}
                                {/*</ListGroupItem>*/}
                                {/*<Modal.Footer>*/}
                                    {/*<Button bsStyle="primary" onClick={saveThreshold} >保存</Button>*/}
                                {/*</Modal.Footer>*/}
                            {/*</Tab>*/}
                            {/*<Tab eventKey={2} title="进程">*/}
                                {/*<MonTable options={options} data={this.props.processinfo}*/}
                                           {/*headers={ processHeaders}/>*/}
                            {/*</Tab>*/}
                            {/*<Tab eventKey={3} title="文件">*/}
                            {/*</Tab>*/}
                            {/*<Tab eventKey={4} title="移动介质">*/}
                            {/*</Tab>*/}
                            {/*<Tab eventKey={5} title="IP包">*/}
                            {/*</Tab>*/}
                            {/*<Tab eventKey={6} title="预警历史">*/}
                            {/*</Tab>*/}
                        {/*</Tabs>*/}
                    {/*</Modal.Body>*/}
                {/**/}
                {/*</Modal>*/}
            </div>


        );
    }
}
