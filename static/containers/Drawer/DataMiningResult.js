/**
 * Created by lan on 17-3-7.
 */
import React, {Component, PropTypes} from 'react';
import { Progress } from 'antd';
import { SERVER_URL } from '../../utils/config';
import DataMiningTable from '../../components/DataMiningTables';
import '../../styles/components/Table.css';
import { Collapse, Row, Col } from 'antd';
const Panel = Collapse.Panel;


const processHeaders = [
    {field: 'user', name: 'user'},
    {field: 'time', name: 'time'},
    {field: 'process_name', name: 'process_name'},
    {field: 'resource_name', name: 'resource_name'},
    {field: 'warning_rank', name: 'warning_rank'},
];


const warningHeaders = [
    {field: 'userid', name: 'userid'},
    {field: 'time', name: 'time'},
    {field: 'description', name: 'description'},
    {field: 'rank', name: 'rank'},
    {field: 'species', name: 'species'},
];


export default class DataMiningResult extends Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div>
                <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                    <Panel header="预警信息挖掘" key="1">
                        <DataMiningTable species="warning_mining_info" host={this.props.host} headers={warningHeaders}/>
                    </Panel>
                    <Panel header="进程占用资源挖掘" key="2">
                        <DataMiningTable species="process_res_info" host={this.props.host} headers={processHeaders}/>
                    </Panel>
                </Collapse>
            </div>

        );
    }
}
