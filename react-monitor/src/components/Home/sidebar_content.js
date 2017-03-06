/**
 * Created by lan on 3/5/17.
 */
import React from 'react';
import MaterialTitlePanel from './material_title_panel';
import {ButtonGroup, Button, Tab, Tabs} from 'react-bootstrap'
import MonTable from './MonitorTable'

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

const values = [['hour', '小时'], ['2h', '2小时'],
    ['4h', '4小时'], ['1d', '一天'], ['1w', '一周'], ['1m', '一月'], ['1y', '一年']];

function renderButtons(values, current) {
    return values.map((value) => {
        let isActive = value[0] == current;
        return <Button key={value[0]} value={value[0]} active={isActive}>{value[1]}</Button>
    })
}

const SidebarContent = (props) => {
    const style = props.style ? {...styles.sidebar, ...props.style} : styles.sidebar;
    const title = props.title;
    const time = props.time;
    console.log(props);
    const links = [];


    return (
        <MaterialTitlePanel title={title} style={style}>
            <div style={styles.content}>
                <ButtonGroup onClick={ (e) => {
                    props.buttonClick(e.target.value);
                }}>
                    {renderButtons(values, time)}
                </ButtonGroup>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Tab 1">
                        <MonTable></MonTable>
                    </Tab>
                    <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
                    <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
                </Tabs>
                <div style={styles.divider} />
                {links}
            </div>
        </MaterialTitlePanel>
    );
};

SidebarContent.propTypes = {
    style: React.PropTypes.object,
};

export default SidebarContent;