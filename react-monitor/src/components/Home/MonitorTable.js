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
        let isKey = col == 'hostname';
        array.push(
            <TableHeaderColumn key={col} dataField={col} dataAlign='center' dataSort={ true }
                               isKey={isKey}>{headers[col]}</TableHeaderColumn>
        );
    }

    return array;
}


export default class MonTable extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }

    showDrawera = ev => {
        ev.preventDefault();
        this.props.showDrawer();
        console.log('ss');
    };




    render() {
        return (
            <BootstrapTable data={products} bordered={ false } options={ {noDataText: 'This is custom text sfor empty data'} }>
                {renderColHeader(headers)}
            </BootstrapTable>
        );
    }
}
