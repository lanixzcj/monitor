import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import '../styles/components/Table.css';
import { Table, Icon, Button, Popconfirm } from 'antd';
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

    onAddRow = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            this.props.onAddRow(values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    onDeleteRow = () => {
        this.props.onDeleteRow(this.state.selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
        console.log(selectedRowKeys)
    };

    getLocalData = () => this.table.getLocalData();

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

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <InsertModal columns={this.props.headers} ref={ref => this.form = ref}
                            visible={this.state.visible} onCancel={this.closeModal}
                            onAddRow={this.onAddRow}/>
                <Button.Group>
                    <Button type="primary" icon="plus" style={{marginBottom: 8}}
                            onClick={this.openModal}>NEW</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={this.onDeleteRow}
                            okText="确定" cancelText="取消">
                        <Button type="danger" icon="delete" style={{marginBottom: 8}}>DELETE</Button>
                    </Popconfirm>

                </Button.Group>
                <Table ref={ref => this.table = ref} rowSelection={rowSelection} dataSource={data} bordered={true} rowKey="id"
                       pagination={{defaultPageSize: 5,}} loading={this.props.loading}>
                    {renderColHeader(this.props.headers) }
                </Table>
            </div>

        );
    }
}
