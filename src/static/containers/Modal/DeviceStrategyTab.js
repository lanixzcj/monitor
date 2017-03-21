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

export default class MonitorModal extends Component {
    constructor(props) {
        super(props);


    }

    saveThreshold = () => {
        let threshold = {
            bytes_in: this.byteinSlider.state.value,
            bytes_out: this.byteoutSlider.state.value,
            cpu_used: this.cpuSlider.state.value,
            disk_used: this.diskSlider.state.value,
            mem_used: this.memSlider.state.value,
        };
        this.props.changeAction(this.props.host, threshold);
    };

    render() {
        const props = {
            isLoading: this.props.isLoading
        };
        return (
            <div>
                <ListGroupItem><strong>硬盘监控</strong></ListGroupItem>
                <ListGroupItem >
                    <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                            min={0} max={this.props.disk_total}
                            {...props}
                            step={1} value={this.props.disk_used} units="GB"/>
                </ListGroupItem>
                <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                <ListGroupItem >
                    <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                            min={0} max={100} step={1}
                            {...props}
                            value={this.props.cpu_used} units="%"/>
                </ListGroupItem>
                <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                <ListGroupItem >
                    <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                            min={0} max={this.props.mem_total} step={1}
                            {...props}
                            value={this.props.mem_used} units="KB"/>
                </ListGroupItem>
                <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                <ListGroupItem >
                    <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                            min={0} max={this.props.bytes_in_max} step={1}
                            {...props}
                            value={this.props.bytes_in} units="KB"/>
                    <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                            min={0} max={this.props.bytes_out_max} step={1}
                            {...props}
                            value={this.props.bytes_out} units="KB"/>
                </ListGroupItem>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.saveThreshold} >保存</Button>
                </Modal.Footer>

            </div>


        );
    }
}
