import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './Table.css';

var products = [{
    id: 1,
    name: "Product1",
    price: 120
}];

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

function dropdownFormatter(cell, row) {
    let menuItem;
    if (row.is_trusted) {
        menuItem = <MenuItem eventKey={1.2}>从信任列表中移除</MenuItem>;
    } else {
        menuItem = <MenuItem eventKey={1.2}>加入信任列表</MenuItem>;
    }

    return (
        <DropdownButton bsStyle='default' title='更多' key={1} id={`dropdown-basic-${row.id}`}>
            <MenuItem eventKey={1.1}>配置安全策略</MenuItem>
            { menuItem }
        </DropdownButton>
    );
}

const cellEditProp = {
    mode: 'click'
};

class ActiveFormatter extends React.Component {
    showDrawera = ev => {
        ev.preventDefault();
        this.props.showDrawer();
        console.log('ss');
    };
    render() {
        return (
            <button onClick={
               this.showDrawera
            }>新增文章</button>
        );
    }
}

export default class MonTable extends Component {
    constructor(props) {
        super(props);
        // this.showDrawera = this.showDrawera.bind(this);
    }
    componentDidMount() {
        this.props.loadArticles();
        // this.props.showDrawer();

    }

    showDrawera = ev => {
        ev.preventDefault();
        this.props.showDrawer();
        console.log('ss');
    };

    statusFormatter(cell, row, enumObject) {
        console.log(enumObject);
        return (
        <ActiveFormatter showDrawer={enumObject}/>
            // <a href="#" onClick={this.showDrawer}>
            // <h1>s</h1>
            //     <i className='glyphicon glyphicon-stats'/>
            // </a>
        );
    }

    handleDelete(record) {
        // Modal.confirm({
        //   title: '提示',
        //   content: '确认要删除该文章吗？'
        // }).then(() => {
        //   this.props.deleteArticle(record);
        // });
    }



    render() {
        return (
            <BootstrapTable data={products} bordered={ false } options={ {noDataText: 'This is custom text sfor empty data'} }>
                <TableHeaderColumn dataField='hostname' dataAlign='center' isKey={ true }>ID/主机名</TableHeaderColumn>
                <TableHeaderColumn dataField='monitor' dataAlign='center' dataFormat={ this.statusFormatter} formatExtraData={ this.props.showDrawer }>监控</TableHeaderColumn>
                <TableHeaderColumn dataField='stat' dataAlign='center'  dataFormat={ statFormatter } formatExtraData={ statType }
                                   columnClassName={ columnClassNameFormat }>状态</TableHeaderColumn>
                <TableHeaderColumn dataField='ip' dataAlign='center' >IP地址</TableHeaderColumn>
                <TableHeaderColumn dataField='mac_address' dataAlign='center' >MAC地址</TableHeaderColumn>
                <TableHeaderColumn dataField='operate' dataAlign='center'  columnClassName='my-class' dataFormat={ dropdownFormatter }>操作</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}
