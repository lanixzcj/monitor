import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './Table.css';

var products = [{
    hostname: 'ss',
    name: "Product1",
    price: 120
}, {
    hostname: 'ss2',
    name: "Product1",
    price: 120
}];

const headers = {
    hostname: '主机名',
    name: '姓名',
    price: '价格',
};

function renderColHeader(headers) {
    let array = new Array();
    for (let col in headers) {
        let isKey = col == 'time';
        let width = col == 'time' ? '180px' : '';
        array.push(
            <TableHeaderColumn key={col} dataField={col} dataAlign='center' dataSort={ true }
                               width={width} isKey={isKey}>{headers[col]}</TableHeaderColumn>
        );
    }

    return array;
}


export default class MonTable extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.host != this.props.host || nextProps.time != this.props.time ) {
            this.props.loadArticles(this.props.name, nextProps.host, nextProps.time);
        }
    }

    render() {
        return (
            <BootstrapTable data={this.props.data} bordered={ false } options={ {noDataText: '没有找到匹配的记录'} }>
                {renderColHeader(this.props.headers)}
            </BootstrapTable>
        );
    }
}
