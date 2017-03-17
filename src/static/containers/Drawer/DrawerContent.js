/**
 * Created by lan on 3/5/17.
 */
import React, {Component} from 'react';
import {ButtonGroup, Button, Tab, Tabs} from 'react-bootstrap'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MonTable from '../../components/MonitorTable'
import DeviceMonitor from './DeviceMonitor'
import * as monitorActions from '../../actions/monitorData';

const styles = {
    sidebar: {
        width: 800,
        height: '100%',
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
    app_name: '应用名称',
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

function renderButtons(values, current) {
    return values.map((value) => {
        let isActive = value[0] == current;
        return <Button key={value[0]} value={value[0]} active={isActive}>{value[1]}</Button>
    })
}

@connect(
    state => ({
        monitor: state.monitor,
    }),
    dispatch => ({
        monitorActions: bindActionCreators(monitorActions, dispatch)
    })
)
export default class SidebarContent extends Component {
    static propTypes = {
        style: React.PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.monitor.host != this.props.monitor.host ||
            nextProps.monitor.time != this.props.monitor.time ) {
            this.props.monitorActions.loadAllMonitors(nextProps.monitor.host, nextProps.monitor.time);
        }
    }

    render() {
        const title = this.props.monitor.host;
        const time = this.props.monitor.time;
        const style = this.props.style ? {...styles.sidebar, ...this.props.style} : styles.sidebar;
        const rootStyle = style ? {...styles.root, ...style} : styles.root;

        const options = {
            search: true,
            exportCSV: true,
        };
        return (


            <div style={rootStyle}>
                <div style={styles.header}>{title}</div>
                <div style={styles.content}>
                    <ButtonGroup onClick={ (e) => {
                        this.props.monitorActions.changeTimeRange(e.target.value);
                    }}>
                        {renderButtons(values, time)}
                    </ButtonGroup>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="设备信息">
                            <DeviceMonitor  data={this.props.monitor.data.deviceinfo} {...this.props.monActions}/>
                        </Tab>
                        <Tab eventKey={2} title="进程">
                            <MonTable options={options}  data={this.props.monitor.data.processinfo} {...this.props.monActions}
                                      headers={ processHeaders}/>
                        </Tab>
                        <Tab eventKey={3} title="文件">
                            <MonTable options={options}  data={this.props.monitor.data.fileinfo} {...this.props.monActions}
                                      headers={ fileHeaders}/>
                        </Tab>
                        <Tab eventKey={4} title="移动介质">
                            <MonTable options={options}  data={this.props.monitor.data.mediainfo} {...this.props.monActions}
                                      headers={ mediaHeaders}/>
                        </Tab>
                        <Tab eventKey={5} title="IP包">
                            <MonTable options={options}  data={this.props.monitor.data.ip_packet} {...this.props.monActions}
                                      headers={ ipHeaders}/>
                        </Tab>
                        <Tab eventKey={6} title="预警历史">
                            <MonTable options={options}  data={this.props.monitor.data.warninginfo} {...this.props.monActions}
                                      headers={ warningHeaders}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}