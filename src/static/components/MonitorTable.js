import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import '../styles/components/Table.css';
import { Table, Icon, Input, Row, Col, Button } from 'antd';
const Search = Input.Search;
const { Column, ColumnGroup } = Table;
import exportCSVUtil from '../utils/csv_export';

function renderColHeader(columns, search) {
    return columns.map((column, i) => {
        const {field, name} = column;
        const filteredValue = search ? [search] : null;
        return <Column title={name} dataIndex={field} key={field} filteredValue={filteredValue}
            onFilter={(value, record) => {
                let flag = false;
                for (let key in record) {
                    const reg = new RegExp(value, 'gi');
                    flag = record[key].toString().match(reg);
                    if (flag) {
                        break;
                    }
                }

                return flag;
            }
            }/>
    });
}


export default class MonTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: null
        }
    }

    onSearch = (value) => {
        this.setState({searchText: value});
    };

    render() {
        console.log(this.state.searchText)
        let data = this.props.data ? this.props.data : [];
        const options = this.props.options ? this.props.options : {};
        options.noDataText = '没有找到匹配的记录';
        const extra = this.props.extra ? this.props.extra : {};
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <Button type="primary" icon="export" style={{marginBottom: 8}}
                                onClick={() => {
                                    exportCSVUtil(this.table.getLocalData(), this.props.headers, 'monitor.csv');
                                    }}>导出CSV</Button>
                    </Col>
                    <Col span={8} offset={8}>
                        <Search style={{marginBottom: 8}}
                                onSearch={this.onSearch}
                                onChange={ (e) => {
                                    this.onSearch(e.target.value);
                                }}/>
                    </Col>
                </Row>

                <Table ref={ref => this.table = ref} dataSource={data} loading={this.props.isLoading} rowKey="id">
                    {renderColHeader(this.props.headers, this.state.searchText)}
                </Table>
            </div>
        );
    }
}
