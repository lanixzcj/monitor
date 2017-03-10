import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {createForm} from 'redux-form-utils';
import formConfig from './Modal.config';
import Slider from './Slider'
import './Modal.css'
import AlertContainer from 'react-alert';
import MonTable from './MonitorTable'

const processHeaders = {
    time: '时间',
    process_name: '进程名称',
};


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


    render() {
        // const {title, desc, date} = this.props.fields

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
        const options = {
            insertRow: true,
            deleteRow: true,
            search: true,
        };

        return (
            <div>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                <Modal show={this.props.visible} onHide={this.props.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>配置{this.props.host}安全策略</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

                            <Tab eventKey={1} title="设备信息">
                                <ListGroupItem><strong>硬盘监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                                            min={0} max={this.props.deviceStrategy.disk_total}
                                            step={1} defaultValue={this.props.deviceStrategy.disk_used} units="GB"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                                            min={0} max={100} step={1}
                                            defaultValue={this.props.deviceStrategy.cpu_used} units="%"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                                            min={0} max={this.props.deviceStrategy.mem_total} step={1}
                                            defaultValue={this.props.deviceStrategy.mem_used} units="KB"/>
                                </ListGroupItem>
                                <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                                <ListGroupItem >
                                    <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                                            min={0} max={this.props.deviceStrategy.bytes_in_max} step={1}
                                            defaultValue={this.props.deviceStrategy.bytes_in} units="KB"/>
                                    <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                                            min={0} max={this.props.deviceStrategy.bytes_out_max} step={1}
                                            defaultValue={this.props.deviceStrategy.bytes_out} units="KB"/>
                                </ListGroupItem>
                                <Modal.Footer>
                                    <Button bsStyle="primary" onClick={saveThreshold} >保存</Button>
                                </Modal.Footer>
                            </Tab>
                            <Tab eventKey={2} title="进程">
                                <MonTable options={options} data={this.props.processinfo}
                                           headers={ processHeaders}/>
                            </Tab>
                            <Tab eventKey={3} title="文件">
                            </Tab>
                            <Tab eventKey={4} title="移动介质">
                            </Tab>
                            <Tab eventKey={5} title="IP包">
                            </Tab>
                            <Tab eventKey={6} title="预警历史">
                            </Tab>
                        </Tabs>
                    </Modal.Body>

                </Modal>
            </div>


        );
    }
}
