/**
 * Created by lan on 3/5/17.
 */
import React, {Component} from 'react';
// import {Tab, Tabs} from 'react-bootstrap'

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

const ipHeaders = {
    time: '时间',
    send_mac_address: '发送MAC地址',
    recv_mac_address: '接收MAC地址',
    send_ip: '发送ip',
    send_port: '发送端口',
    recv_ip: '接收ip',
    recv_port: '接收端口',
};

const fileHeaders = {
    time: '时间',
    file_name: '文件名',
    user: '用户',
    operate_type: '操作类型',
    modify_size: '修改大小(KB)',
};

const mediaHeaders = {
    time: '时间',
    media_name: '介质名',
    media_size: '介质大小(MB)',
    io_type: '操作类型',
    operate_file: '所操作的文件名',
};

const processHeaders = {
    time: '时间',
    process_name: '进程名称',
    process_id: '进程id',
    user: '用户',
    boottime: '启动时间',
    runtime: '运行时间',
    used_ports: '占用端口'
};


const warningHeaders = {
    time: '时间',
    warning_type: '预警类别',
    warning_content: '预警内容',
    warning_level: '预警等级',
};

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