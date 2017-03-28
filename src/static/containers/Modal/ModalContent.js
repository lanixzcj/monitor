import React, {Component, PropTypes} from 'react';
import {Button, Tab,  ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import Slider from '../../components/Slider'
import '../../styles/components/Modal.css'
import AlertContainer from 'react-alert';
import MonTable from '../../components/MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'
import DeviceTab from './DeviceStrategyTab'
import FileStrategyTab from './FileStrategyTab'
import IpStrategyTab from './IpStrategyTab'
import { Modal, Tabs, Spin } from 'antd';
const TabPane = Tabs.TabPane;


@connect(
    state => ({
        strategy: state.strategy
    }),
    dispatch => ({
        strategyActions: bindActionCreators(strategyActions, dispatch),
    }), null, { withRef: true }
)
export default class MonitorModal extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.strategyActions.loadStrategy(this.props.host);
    }

    render() {
        const strategy = this.props.strategy;
        let files = [];
        let ip_packet = [];
        let device = {};

        if (strategy.data) {
            files = strategy.data.files ? strategy.data.files : [];
            ip_packet = strategy.data.ip_packet ? strategy.data.ip_packet : [];
            device = strategy.data.device ? strategy.data.device : {};
        }
        return (
            <Spin spinning={strategy.isLoading}>
                <Tabs defaultActiveKey='1'>
                    <TabPane key='1' tab="设备信息">
                        <DeviceTab isLoading={strategy.isLoading} {...device} host={this.props.host}
                                   changeAction={this.props.strategyActions.changeDeviceStrategy}/>
                    </TabPane>
                    <TabPane key='2' tab="文件">
                        <FileStrategyTab data={files} host={this.props.host}/>
                    </TabPane>
                    <TabPane key='3' tab="IP包">
                        <IpStrategyTab data={ip_packet} host={this.props.host}/>
                    </TabPane>
                </Tabs>
            </Spin>

        );
    }
}
