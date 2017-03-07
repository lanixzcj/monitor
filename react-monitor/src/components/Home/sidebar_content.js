/**
 * Created by lan on 3/5/17.
 */
import React from 'react';
import MaterialTitlePanel from './material_title_panel';
import {ButtonGroup, Button, Tab, Tabs} from 'react-bootstrap'
import MonTable from './MonitorTable'
import DeviceMonitor from './deviceMonitor'

const styles = {
    sidebar: {
        width: 600,
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

const SidebarContent = (props) => {
    const style = props.style ? {...styles.sidebar, ...props.style} : styles.sidebar;
    const title = props.drawer.host;
    const time = props.drawer.time;
    const links = [];

    return (
        <MaterialTitlePanel title={title} style={style}>
            <div style={styles.content}>
                <ButtonGroup onClick={ (e) => {
                    props.drawerActions.buttonClick(e.target.value);
                }}>
                    {renderButtons(values, time)}
                </ButtonGroup>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="设备信息">
                        <DeviceMonitor host={title} time={time} name="deviceinfo"  {...props.deviceInfo} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={2} title="进程">
                        <MonTable  host={title} headers={ processHeaders} name="processinfo"
                                   time={time} {...props.processInfo} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={3} title="文件">
                        <MonTable  host={title} headers={ fileHeaders} name="fileinfo"
                                   time={time} {...props.fileInfo} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={4} title="移动介质">
                        <MonTable  host={title} headers={ mediaHeaders} name="mediainfo"
                                   time={time} {...props.mediaInfo} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={5} title="IP包">
                        <MonTable  host={title} headers={ ipHeaders} name="ip_packet"
                                   time={time} {...props.ipPacket} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={6} title="预警历史">
                        <MonTable  host={title} headers={ warningHeaders} name="warninginfo"
                                   time={time} {...props.warningInfo} {...props.monActions}/>
                    </Tab>
                </Tabs>
            </div>
        </MaterialTitlePanel>
    );
};

SidebarContent.propTypes = {
    style: React.PropTypes.object,
};

export default SidebarContent;