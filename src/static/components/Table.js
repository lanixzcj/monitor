import React, {Component, PropTypes} from 'react';
import { Table, Icon ,Dropdown, Button, Menu} from 'antd';
const { Column, ColumnGroup, } = Table;
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../styles/components/Table.css';




function renderStat(text, row, index) {
    const statType = {
        '0unsafe': '危险',
        '1online': '在线中',
        '2offline': '离线'
    };
    return <span className={columnClassNameFormat(text)}>{statType[text]}</span> ;
}

function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
    switch (fieldValue) {
        case '0unsafe':
            return 'text-danger';
        case '1online':
            return 'text-success';
        case '2offline':
            return 'text-warning';
        default:
            return ''
    }
}

function dropdownFormatter(cell, row, enumObject) {
    let menuItem = new Array();
    if (row.hostname !== undefined && row.hostname.length != 0) {
        menuItem.push(<MenuItem key={1.1} eventKey={1.1} onClick={
            () => {
                enumObject.showModal(row.hostname);
            }
        }>配置安全策略</MenuItem>);
    }
    if (row.is_trusted) {
        menuItem.push(<MenuItem key={1.2} eventKey={1.2} onClick= {
            () => {
                enumObject.removeTrustedHost(row.mac_address);
            }}>从信任列表中移除</MenuItem>);
    } else {
        menuItem.push(<MenuItem key={1.2} eventKey={1.2} onClick= {
            () => {
                enumObject.addTrustedHost(row.mac_address);
            }}>加入信任列表</MenuItem>);
    }

    return (
        <DropdownButton bsStyle='default' title='更多' key={1} id={`dropdown-basic-${row.id}`}>
            { menuItem }
        </DropdownButton>
    );
}

function statusFormatter(cell, row, enumObject) {
    return (
        (row.hostname == undefined || row.hostname.length == 0) ?
            <div> </div> :
            <a href="#" onClick= {
                () => {
                    enumObject(row.hostname);
                }}>
                <i className='glyphicon glyphicon-stats' />
            </a>
    );
}



export default class MonTable extends Component {
    static propTypes = {
        hosts: React.PropTypes.object,
        showDrawer: React.PropTypes.func,
        showModal: React.PropTypes.func,
        loadHosts: React.PropTypes.func,
    };

    static defaultProps = {
        hosts: []
    };

    constructor(props) {
        super(props);

        this.columns = [{
            title: 'ID/主机名',
            dataIndex: 'hostname',
            width: '16%',
        }, {
            title: '监控',
            dataIndex: 'monitor',
            width: '16%',
            render: this.renderMonitor,
        }, {
            title: '状态',
            dataIndex: 'stat',
            width: '16%',
            render: renderStat,
        }, {
            title: 'IP地址',
            dataIndex: 'ip',
            width: '16%',
        }, {
            title: 'MAC地址',
            dataIndex: 'mac_address',
            width: '16%',
        }, {
            title: '操作',
            dataIndex: 'operate',
            width: '16%',
            render: this.renderDropdown
        }];
    }

    renderMonitor = (text, row, index) => {
        return (
            (row.hostname == undefined || row.hostname.length == 0) ?
                <div> </div> :
                <a href="#" onClick= {
                    () => {
                        this.props.showDrawer(row.hostname);
                    }}>
                    <i className='glyphicon glyphicon-stats' />
                </a>
        );
    };

    renderDropdown = (text, row, index) => {
        const handleMenuClick = (e) => {
            switch (e.key) {
                case '1':
                    this.props.showModal(row.hostname);
                    break;
                case '2':
                    this.props.removeTrustedHost(row.mac_address);
                    break;
                case '3':
                    this.props.addTrustedHost(row.mac_address);
                    break;
                default: break;
            }
        };
        let menuItem = new Array();
        if (row.hostname !== undefined && row.hostname.length != 0) {
            menuItem.push(<Menu.Item key={`1`}>配置安全策略</Menu.Item>);
        }
        if (row.is_trusted) {
            menuItem.push(<Menu.Item key={`2`}>从信任列表中移除</Menu.Item>);
        } else {
            menuItem.push(<Menu.Item key={`3`}>加入信任列表</Menu.Item>);
        }
        const menu = <Menu onClick={handleMenuClick}>{menuItem}</Menu>;

        return (
            <Dropdown overlay={menu} key={`${index}`} >
                <Button style={{ marginLeft: 8 }}>
                更多 <Icon type="down" />
                </Button>
            </Dropdown>
        );
    };

    componentWillMount() {
        this.props.loadHosts();
    }

    render() {
        let noDataText;
        if (this.props.hosts.isLoading) {
            noDataText = '正在加载...';
        } else {
            noDataText = '没有找到匹配的记录';
        }
        {/*<BootstrapTable  data={this.props.hosts.data} bordered={ false } options={ {noDataText: noDataText} }>*/}
        {/*<TableHeaderColumn dataField='hostname' dataAlign='center' >ID/主机名</TableHeaderColumn>*/}
        {/*<TableHeaderColumn dataField='monitor' dataAlign='center' dataFormat={ statusFormatter} formatExtraData={ this.props.showDrawer }>监控</TableHeaderColumn>*/}
        {/*<TableHeaderColumn dataField='stat' dataAlign='center'  dataFormat={ statFormatter } formatExtraData={ statType }*/}
        {/*columnClassName={ columnClassNameFormat }>状态</TableHeaderColumn>*/}
        {/*<TableHeaderColumn dataField='ip' dataAlign='center' >IP地址</TableHeaderColumn>*/}
        {/*<TableHeaderColumn dataField='mac_address' dataAlign='center' isKey={ true } >MAC地址</TableHeaderColumn>*/}
        {/*<TableHeaderColumn dataField='operate' dataAlign='center'  columnClassName='my-dropdown-content' dataFormat={ dropdownFormatter } formatExtraData={ this.props }>操作</TableHeaderColumn>*/}
        {/*</BootstrapTable>*/}

        return (
            <Table columns={this.columns} loading={this.props.hosts.isLoading} dataSource={this.props.hosts.data} rowKey="mac_address">

            </Table>
        );
    }
}
