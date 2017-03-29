import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import '../styles/components/Table.css';
import { Table, Icon } from 'antd';
const { Column, ColumnGroup } = Table;

function renderColHeader(columns) {
    return columns.map((column, i) => {
        const {field, name} = column;
        return <Column title={name} dataIndex={field} key={field}/>
    });
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
            <Table dataSource={data} loading={this.props.isLoading} rowKey="id">
                {renderColHeader(this.props.headers)}
            </Table>
        );
    }
}
