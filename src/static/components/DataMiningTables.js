import React, {Component, PropTypes} from 'react';
import '../styles/components/Table.css';
import fetch from 'isomorphic-fetch';
import { Table, Icon, Input, Row, Col, Button, Select } from 'antd';
const Option = Select.Option;
const Search = Input.Search;
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
const { Column, ColumnGroup } = Table;
import exportCSVUtil from '../utils/csv_export';

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
            isLoading: false,
            data: {}
        }
    }

    componentDidMount() {
        this.fetchData(1);
    }

    handleChange = (type) => {
        console.log(type)
        this.fetchData(type);
    };

    fetchData = (type) => {
        this.setState({
            isLoading: true,
        });
        fetch(`${SERVER_URL}/api/v1/monitor/monitor/${this.props.species}/` +
            `${this.props.hosts}?type=${type}`, {

        }).then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                console.log(response)
                this.setState({
                    isLoading: false,
                    data: response
                })
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    data: {}
                })
            });
    };


    render() {
        let associate = this.state.data['association'] ? this.state.data['association'] : [];
        let frequent = this.state.data['frequent'] ? this.state.data['frequent'] : [];

        return (
            <div>
                <Row>
                    <Col span={8}>
                        <h5>关联规则</h5>
                    </Col>
                    <Col span={8} offset={8}>
                        <Select style={{float: 'right'}} defaultValue="type1" onChange={this.handleChange}>
                            <Option value="1">type1</Option>
                            <Option value="2">type2</Option>
                            <Option value="3">type3</Option>
                        </Select>
                    </Col>

                </Row>

                <Table ref={ref => this.table = ref} dataSource={associate} loading={this.props.isLoading} rowKey="id">
                    {renderColHeader(this.props.headers)}
                </Table>

                <Row style={{marginTop: 8}}>
                    <Col span={8}>
                        <h5>频繁项目</h5>
                    </Col>
                </Row>

                <Table ref={ref => this.table = ref} dataSource={frequent} loading={this.props.isLoading} rowKey="id">
                    {renderColHeader(this.props.headers)}
                </Table>
            </div>
        );
    }
}