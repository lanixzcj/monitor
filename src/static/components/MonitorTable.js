import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import '../styles/components/Table.css';
import { Table, Icon, Input, Row, Col, Button } from 'antd';
const Search = Input.Search;
const { Column, ColumnGroup } = Table;
import exportCSVUtil from '../utils/csv_export';
import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';

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

        let data = props.data ? props.data[0] : [];
        let num = props.data ? props.data[1] : 0;
        this.state = {
            data: data,
            searchText: null,
            pagination: {current: 1, total: num},
            isLoading: props.isLoading
        }
    }

    componentWillReceiveProps(nextProps) {
        let data = nextProps.data ? nextProps.data[0] : [];
        let num = nextProps.data ? nextProps.data[1] : 0;
        const pager = { ...this.state.pagination };
        pager.total = num;
        this.state = {
            isLoading: nextProps.isLoading,
            data: data,
            pagination: pager
        }
    }

    onSearch = (value) => {
        this.setState({searchText: value});
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.getData(pagination);
    };

    getData = (pagination)=> {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;

        this.setState({
            isLoading: true,
        });
        fetch(`${SERVER_URL}/api/v1/monitor/monitor/${this.props.name}/` +
            `${this.props.host.host}?r=${this.props.host.time}&page=${pagination.current}`, {
        }).then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                pager.total = response[1];
                this.setState({
                    isLoading: false,
                    data: response[0],
                    pagination: pager,
                })
            })
            .catch(() => {
                pager.total = 0;
                this.setState({
                    isLoading: false,
                    data: [],
                    pagination: pager,
                })
            });
    };

    render() {
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

                <Table ref={ref => this.table = ref} pagination={this.state.pagination}
                       dataSource={this.state.data} loading={this.state.isLoading}
                       rowKey="id" onChange={this.handleTableChange}>
                    {renderColHeader(this.props.headers, this.state.searchText)}
                </Table>
            </div>
        );
    }
}
