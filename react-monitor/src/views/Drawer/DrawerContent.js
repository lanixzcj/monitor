/**
 * Created by lan on 3/5/17.
 */
import React, {Component} from 'react';
import MaterialTitlePanel from '../../components/Home/DrawerTitle';
import {ButtonGroup, Button, Tab, Tabs} from 'react-bootstrap'
import MonTable from '../../components/Home/MonitorTable'
import DeviceMonitor from '../../components/Home/deviceMonitor'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {drawerActions, monActions} from './DrawerRedux';

const styles = {
    sidebar: {
        width: 1000,
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
        drawer: state.monitors.drawer,
        all: state.monitors.all,
    }),
    dispatch => ({
        drawerActions: bindActionCreators(drawerActions, dispatch),
        monActions: bindActionCreators(monActions, dispatch),
    })
)
export default class SidebarContent extends Component {
    static propTypes = {
        style: React.PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawer.host != this.props.drawer.host ||
            nextProps.drawer.time != this.props.drawer.time ) {
            this.props.monActions.loadAllMonitors(nextProps.drawer.host, nextProps.drawer.time);
        }
    }

    render() {
        const title = this.props.drawer.host;
        const time = this.props.drawer.time;
        const style = this.props.style ? {...styles.sidebar, ...this.props.style} : styles.sidebar;

        const options = {
            search: true,
            exportCSV: true,
        };
        return (
            <MaterialTitlePanel title={title} style={style}>
                <div style={styles.content}>
                    <ButtonGroup onClick={ (e) => {
                        this.props.drawerActions.buttonClick(e.target.value);
                    }}>
                        {renderButtons(values, time)}
                    </ButtonGroup>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="设备信息">
                            <DeviceMonitor  data={this.props.all.all_data.deviceinfo} {...this.props.monActions}/>
                        </Tab>
                        <Tab eventKey={2} title="进程">
                            <MonTable options={options}  data={this.props.all.all_data.processinfo} {...this.props.monActions}
                                       headers={ processHeaders}/>
                        </Tab>
                        <Tab eventKey={3} title="文件">
                            <MonTable options={options}  data={this.props.all.all_data.fileinfo} {...this.props.monActions}
                                       headers={ fileHeaders}/>
                        </Tab>
                        <Tab eventKey={4} title="移动介质">
                            <MonTable options={options}  data={this.props.all.all_data.mediainfo} {...this.props.monActions}
                                       headers={ mediaHeaders}/>
                        </Tab>
                        <Tab eventKey={5} title="IP包">
                            <MonTable options={options}  data={this.props.all.all_data.ip_packet} {...this.props.monActions}
                                       headers={ ipHeaders}/>
                        </Tab>
                        <Tab eventKey={6} title="预警历史">
                            <MonTable options={options}  data={this.props.all.all_data.warninginfo} {...this.props.monActions}
                                       headers={ warningHeaders}/>
                        </Tab>
                    </Tabs>
                    {/*<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">*/}
                    {/*<Tab eventKey={1} title="设备信息">*/}
                    {/*<DeviceMonitor host={title} time={time} name="deviceinfo"*/}
                    {/*{...this.props.deviceInfo} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab eventKey={2} title="进程">*/}
                    {/*<MonTable host={title} headers={ processHeaders} name="processinfo"*/}
                    {/*time={time} {...this.props.processInfo} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab eventKey={3} title="文件">*/}
                    {/*<MonTable host={title} headers={ fileHeaders} name="fileinfo"*/}
                    {/*time={time} {...this.props.fileInfo} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab eventKey={4} title="移动介质">*/}
                    {/*<MonTable host={title} headers={ mediaHeaders} name="mediainfo"*/}
                    {/*time={time} {...this.props.mediaInfo} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab eventKey={5} title="IP包">*/}
                    {/*<MonTable host={title} headers={ ipHeaders} name="ip_packet"*/}
                    {/*time={time} {...this.props.ipPacket} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab eventKey={6} title="预警历史">*/}
                    {/*<MonTable host={title} headers={ warningHeaders} name="warninginfo"*/}
                    {/*time={time} {...this.props.warningInfo} {...this.props.monActions}/>*/}
                    {/*</Tab>*/}
                    {/*</Tabs>*/}
                </div>
            </MaterialTitlePanel>
        );
    }
}