import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../styles/components/Table.css';
import {toastr} from 'react-redux-toastr'

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

    customFooter = () => {
        return (
            <InsertModalFooter
                saveBtnText="保存"
                closeBtnText="取消"
            />
        )
    };

    customHeader = () => {
        return (
            <InsertModalHeader
                title="添加"
            />
        )
    };

    render() {

        const selectRowProp = {
            mode: 'checkbox',
        };
        const defaultExtra = {
            insertRow: true,
            deleteRow: true,
            search: true,
            selectRow: selectRowProp,
        };

        const defaultOptions = {
            insertModalHeader: this.customHeader,
            insertModalFooter: this.customFooter,
        };

        let data = this.props.data ? this.props.data : [];
        const options = {...defaultOptions, ...this.props.options,
            onAddRow: this.props.onAddRow, onDeleteRow: this.props.onDeleteRow,
            noDataText: '没有找到匹配的记录'};
        const extra = {...defaultExtra, ...this.props.extra};
        return (
            <BootstrapTable pagination {...extra} data={data} bordered={ false } options={ options }>
                {renderColHeader(this.props.headers)}
            </BootstrapTable>
        );
    }
}
