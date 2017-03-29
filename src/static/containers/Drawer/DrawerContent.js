/**
 * Created by lan on 3/5/17.
 */
import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MonTable from '../../components/MonitorTable'
import DeviceMonitor from './DeviceMonitor'
import * as monitorActions from '../../actions/monitorData';
import { Button, Radio, Tabs } from 'antd';
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

const styles = {
    sidebar: {
        // width: 700,
    },
    sidebarLink: {
        display: 'block',
        padding: '16px 0px',
        color: '#757575',
        textDecoration: 'none',
    },
    divider: {
        margin: '8px 0',
        height: 1,
        backgroundColor: '#757575',
    },
    content: {
        padding: '16px',
        height: '100%',
        backgroundColor: 'white',
    },
    root: {
        fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
        fontWeight: 300,
    },
    header: {
        backgroundColor: '#03a9f4',
        color: 'white',
        padding: '16px',
        fontSize: '1.5em',
    },
};

const ipHeaders = [
    {field: 'time', name: '时间'},
    {field: 'send_mac_address', name: '发送MAC地址'},
    {field: 'recv_mac_address', name: '接收MAC地址'},
    {field: 'send_ip', name: '发送端口'},
    {field: 'send_port', name: '时间'},
    {field: 'recv_ip', name: '接收IP'},
    {field: 'recv_port', name: '接收端口'},
];

const fileHeaders = [
    {field: 'time', name: '时间'},
    {field: 'file_name', name: '文件名'},
    {field: 'user', name: '用户'},
    {field: 'operate_type', name: '操作类型'},
    {field: 'modyfy_size', name: '修改大小(KB)'},
];

const mediaHeaders = [
    {field: 'time', name: '时间'},
    {field: 'media_name', name: '介质名'},
    {field: 'media_size', name: '介质大小(KB)'},
    {field: 'io_type', name: '操作类型'},
    {field: 'operate_file', name: '所操作的文件名'},
];

const processHeaders = [
    {field: 'time', name: '时间'},
    {field: 'process_name', name: '进程名称'},
    {field: 'process_id', name: '进程id'},
    {field: 'user', name: '用户'},
    {field: 'boottime', name: '启动时间'},
    {field: 'runtime', name: '运行时间'},
    {field: 'used_ports', name: '占用端口'},
];


const warningHeaders = [
    {field: 'time', name: '时间'},
    {field: 'warning_type', name: '预警类别'},
    {field: 'warning_content', name: '预警内容(KB)'},
    {field: 'warning_level', name: '预警等级'},
];

const values = [['hour', '小时'], ['2h', '2小时'],
    ['4h', '4小时'], ['day', '一天'], ['week', '一周'], ['month', '一月'], ['year', '一年']];

function renderButtons(values) {
    return values.map((value) => {
        return <Radio.Button key={value[0]} value={value[0]}>{value[1]}</Radio.Button>
    })
}

@connect(
    state => ({
        monitor: state.monitor,
    }),
    dispatch => ({
        monitorActions: bindActionCreators(monitorActions, dispatch)
    }), null, { withRef: true }
)
export default class SidebarContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 'hour'
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.monitor.host != this.props.monitor.host ||
    //         nextProps.monitor.time != this.props.monitor.time ) {
    //         this.props.monitorActions.loadAllMonitors(nextProps.monitor.host, nextProps.monitor.time);
    //     }
    // }

    shouldComponentUpdate(nextProps) {
        return !(nextProps.monitor.data == null);
    }
    //
    // componentWillUpdate() {
    //     Perf.start();
    // }
    //
    // componentDidUpdate() {
    //     Perf.stop();
    //     // Perf.printWasted();
    // }

    render() {
        const title = this.props.host;
        const time = this.state.time;
        const style = this.props.style ? {...styles.sidebar, ...this.props.style} : styles.sidebar;
        const rootStyle = style ? {...styles.root, ...style} : styles.root;

        const options = {
            search: true,
            exportCSV: true,
        };
        return (
            <div >
                <div style={styles.header}>{title}</div>
                <div style={styles.content}>
                    <Radio.Group onChange={ (e) => {
                        this.setState({time: e.target.value});
                        this.props.monitorActions.loadAllMonitors(this.props.host, e.target.value);
                    }} style={{padding: '0 0 20px 0'}} value={time}>
                        {renderButtons(values)}
                    </Radio.Group>
                    {this.props.monitor.data == null ? <div></div> :
                    <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                        <TabPane key="1" tab="设备信息">
                            <DeviceMonitor  host={this.props.host} time={this.state.time}
                                            data={this.props.monitor.data.deviceinfo} {...this.props.monActions}/>
                        </TabPane>
                        <TabPane key="2" tab="进程">
                            <MonTable options={options}  data={this.props.monitor.data.processinfo} {...this.props.monActions}
                                      headers={ processHeaders} isLoading={this.props.monitor.isLoading}/>
                        </TabPane>
                        <TabPane key="3" tab="文件">
                            <MonTable options={options}  data={this.props.monitor.data.fileinfo} {...this.props.monActions}
                                      headers={ fileHeaders} isLoading={this.props.monitor.isLoading}/>
                        </TabPane>
                        <TabPane key="4" tab="移动介质">
                            <MonTable options={options}  data={this.props.monitor.data.mediainfo} {...this.props.monActions}
                                      headers={ mediaHeaders} isLoading={this.props.monitor.isLoading}/>
                        </TabPane>
                        <TabPane key="5" tab="IP包">
                            <MonTable options={options}  data={this.props.monitor.data.ip_packet} {...this.props.monActions}
                                      headers={ ipHeaders} isLoading={this.props.monitor.isLoading}/>
                        </TabPane>


                        <TabPane key="6" tab="预警历史">
                            <MonTable options={options}  data={this.props.monitor.data.warninginfo} {...this.props.monActions}
                                      headers={ warningHeaders} isLoading={this.props.monitor.isLoading}/>
                        </TabPane>
                    </Tabs>}
                </div>
            </div>
        );
    }
}