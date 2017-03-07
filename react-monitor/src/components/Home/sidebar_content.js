/**
 * Created by lan on 3/5/17.
 */
import React from 'react';
import MaterialTitlePanel from './material_title_panel';
import {ButtonGroup, Button, Tab, Tabs} from 'react-bootstrap'
import MonTable from './MonitorTable'

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
                    <Tab eventKey={1} title="IP包">
                        <MonTable  host={title} headers={ ipHeaders} name="ip_packet"
                                   time={time} {...props.ipPacket} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={2} title="文件">
                        <MonTable  host={title} headers={ fileHeaders} name="fileinfo"
                                   time={time} {...props.fileInfo} {...props.monActions}/>
                    </Tab>
                    <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
                </Tabs>
            </div>
        </MaterialTitlePanel>
    );
};

SidebarContent.propTypes = {
    style: React.PropTypes.object,
};

export default SidebarContent;