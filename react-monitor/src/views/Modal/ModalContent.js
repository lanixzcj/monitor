/**
 * Created by lan on 17-3-9.
 */
import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tableActions, modalActions, drawerActions, monActions} from '../Home/HomeRedux';
import Slider from '../../components/Home/Slider'

// @createForm(formConfig)
export default class ArticleModal extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal.host != this.props.modal.host) {
            this.props.modalActions.loadDeviceStrategy(nextProps.modal.host);
        }
    }

    render() {
        // const {title, desc, date} = this.props.modal.fields

        const saveThreshold = () => {
            let threshold = {
                bytes_in: this.byteinSlider.state.value,
                bytes_out: this.byteoutSlider.state.value,
                cpu_used: this.cpuSlider.state.value,
                disk_used: this.diskSlider.state.value,
                mem_used: this.memSlider.state.value,
            };

            this.props.modal.changeDeviceStrategy(this.props.modal.host, threshold);
        };
        return (
            <div>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="设备信息">
                        <ListGroupItem><strong>硬盘监控</strong></ListGroupItem>
                        <ListGroupItem >
                            <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                                    min={0} max={this.props.modal.deviceStrategy.disk_total}
                                    step={1} defaultValue={this.props.modal.deviceStrategy.disk_used} units="GB"/>
                        </ListGroupItem>
                        <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                        <ListGroupItem >
                            <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                                    min={0} max={100} step={1}
                                    defaultValue={this.props.modal.deviceStrategy.cpu_used} units="%"/>
                        </ListGroupItem>
                        <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                        <ListGroupItem >
                            <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                                    min={0} max={this.props.modal.deviceStrategy.mem_total} step={1}
                                    defaultValue={this.props.modal.deviceStrategy.mem_used} units="KB"/>
                        </ListGroupItem>
                        <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                        <ListGroupItem >
                            <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                                    min={0} max={this.props.modal.deviceStrategy.bytes_in_max} step={1}
                                    defaultValue={this.props.modal.deviceStrategy.bytes_in} units="KB"/>
                            <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                                    min={0} max={this.props.modal.deviceStrategy.bytes_out_max} step={1}
                                    defaultValue={this.props.modal.deviceStrategy.bytes_out} units="KB"/>
                        </ListGroupItem>
                        <Modal.Footer>
                            <Button bsStyle="primary" onClick={saveThreshold}>保存</Button>
                        </Modal.Footer>
                    </Tab>
                    <Tab eventKey={2} title="进程">
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
            </div>

        );
    }
}
