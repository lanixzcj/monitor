import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../styles/components/Table.css';


const statType = {
    '0unsafe': '危险',
    '1online': '在线中',
    '2offline': '离线'
};

function statFormatter(cell, row, enumObject) {
    return enumObject[cell];
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
    let menuItem;
    if (row.is_trusted) {
        menuItem = <MenuItem eventKey={1.2} onClick= {
            () => {
                enumObject.removeTrustedHost(row.mac_address);
            }}>从信任列表中移除</MenuItem>;
    } else {
        menuItem = <MenuItem eventKey={1.2} onClick= {
            () => {
                enumObject.addTrustedHost(row.mac_address);
            }}>加入信任列表</MenuItem>;
    }

    return (
        <DropdownButton bsStyle='default' title='更多' key={1} id={`dropdown-basic-${row.id}`}>
            <MenuItem eventKey={1.1} onClick={
                () => {
                    enumObject.showModal(row.hostname);
                }
            }>配置安全策略</MenuItem>
            { menuItem }
        </DropdownButton>
    );
}

function statusFormatter(cell, row, enumObject) {
    return (
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
        hosts: React.PropTypes.array,
        showDrawer: React.PropTypes.func,
        showModal: React.PropTypes.func,
        loadHosts: React.PropTypes.func,
    };

    static defaultProps = {
        hosts: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadHosts();
    }

    render() {
        return (
            <BootstrapTable  data={this.props.hosts} bordered={ false } options={ {noDataText: '没有找到匹配的记录'} }>
                <TableHeaderColumn dataField='hostname' dataAlign='center' >ID/主机名</TableHeaderColumn>
                <TableHeaderColumn dataField='monitor' dataAlign='center' dataFormat={ statusFormatter} formatExtraData={ this.props.showDrawer }>监控</TableHeaderColumn>
                <TableHeaderColumn dataField='stat' dataAlign='center'  dataFormat={ statFormatter } formatExtraData={ statType }
                                   columnClassName={ columnClassNameFormat }>状态</TableHeaderColumn>
                <TableHeaderColumn dataField='ip' dataAlign='center' >IP地址</TableHeaderColumn>
                <TableHeaderColumn dataField='mac_address' dataAlign='center' isKey={ true } >MAC地址</TableHeaderColumn>
                <TableHeaderColumn dataField='operate' dataAlign='center'  columnClassName='my-dropdown-content' dataFormat={ dropdownFormatter } formatExtraData={ this.props }>操作</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}
