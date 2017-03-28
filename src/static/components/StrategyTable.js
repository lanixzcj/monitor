import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../styles/components/Table.css';
import {toastr} from 'react-redux-toastr'
import { Table, Icon, Button } from 'antd';
const { Column, ColumnGroup } = Table;
import InsertModal from './insertModal'

function renderColHeader(columns) {
    return columns.map((column, i) => {
        const {field, name} = column;
        return <Column title={name} dataIndex={field} key={field}/>
    });
}


export default class MonTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedRowKeys: [],
        };
    }

    openModal = () => {
        this.setState({
            visible: true
        });
    };

    closeModal = () => {
        this.setState({
            visible: false
        });
    };

    onAdd = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
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

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <InsertModal columns={this.props.headers} ref={ref => this.form = ref}
                            visible={this.state.visible} onCancel={this.closeModal}
                            onAdd={this.onAdd}/>
                <Button.Group>
                    <Button type="primary" icon="plus" style={{marginBottom: 8}}
                            onClick={() => {
                                this.openModal();
                            }}
                    >NEW</Button>
                    <Button type="danger" icon="delete" style={{marginBottom: 8}}>DELETE</Button>
                </Button.Group>
                <Table rowSelection={rowSelection} dataSource={data} bordered={true}>
                    {renderColHeader(this.props.headers)}
                </Table>
            </div>

        );
    }
}
