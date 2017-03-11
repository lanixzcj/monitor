import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './Table.css';

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

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.host != this.props.host || nextProps.time != this.props.time ) {
    //         this.props.loadMonitors(this.props.name, nextProps.host, nextProps.time);
    //     }
    // }

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
