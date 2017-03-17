import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './Table.css';

function renderColHeader(headers) {
    let array = new Array();
    array.push(
        <TableHeaderColumn key='ID' dataField='id' autoValue hidden isKey>ID</TableHeaderColumn>
    );
    for (let col in headers) {
        let width;
        let name;
        if (typeof headers[col] == 'string') {
            name = headers[col];
            width = col == 'time' ? '180px' : '';
        } else if (typeof headers[col] == 'object') {
            name = headers[col].name;
        }

        array.push(
            <TableHeaderColumn key={col} dataField={col} dataAlign='center' dataSort={ true }
               editable={headers[col].editable}  width={width} >{name}</TableHeaderColumn>
        );
    }

    return array;
}


export default class MonTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data ? this.props.data : [];
        const options = this.props.options ? this.props.options : {};
        options.noDataText = '没有找到匹配的记录';
        const extra = this.props.extra ? this.props.extra : {};
        return (
            <BootstrapTable {...extra} data={data} bordered={ false } options={ options }>
                {renderColHeader(this.props.headers)}
            </BootstrapTable>
        );
    }
}