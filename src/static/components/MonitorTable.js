import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../styles/components/Table.css';
import { Table, Icon } from 'antd';
const { Column, ColumnGroup } = Table;

function renderColHeader(headers) {
    let array = new Array();
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
            <Column
                title={name}
                dataIndex={col}
                key={col}
            />
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
            <Table dataSource={data} loading={this.props.isLoading}>
                {renderColHeader(this.props.headers)}
            </Table>
        );
    }
}
