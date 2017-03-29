import React, {Component, PropTypes} from 'react';
import { Button } from 'antd';
import {connect} from 'react-redux';
import Slider from '../../components/Slider'
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

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

                <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
                    <Panel header="硬盘监控" key="1">
                        <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                                min={0} max={this.props.disk_total}
                                {...props}
                                step={1} value={this.props.disk_used} units="GB"/>
                    </Panel>
                    <Panel header="CPU监控" key="2">
                        <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                                min={0} max={100} step={1}
                                {...props}
                                value={this.props.cpu_used} units="%"/>
                    </Panel>
                    <Panel header="内存监控" key="3">
                        <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                                min={0} max={this.props.mem_total} step={1}
                                {...props}
                                value={this.props.mem_used} units="KB"/>
                    </Panel>
                    <Panel header="网络监控" key="4">
                        <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                                min={0} max={this.props.bytes_in_max} step={1}
                                {...props}
                                value={this.props.bytes_in} units="KB"/>
                        <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                                min={0} max={this.props.bytes_out_max} step={1}
                                {...props}
                                value={this.props.bytes_out} units="KB"/>
                    </Panel>
                </Collapse>
                <div style={{padding: '15px',textAlign: 'right' }}>
                    <Button type="primary" loading={this.props.isLoading}
                            onClick={this.saveThreshold} >保存</Button>
                </div>

            </div>


        );
    }
}
