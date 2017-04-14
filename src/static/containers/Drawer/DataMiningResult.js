/**
 * Created by lan on 17-3-7.
 */
import React, {Component, PropTypes} from 'react';
import { Progress } from 'antd';
import { SERVER_URL } from '../../utils/config';
import '../../styles/components/Table.css';
import { Collapse, Row, Col } from 'antd';
const Panel = Collapse.Panel;

export default class DataMiningResult extends Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div>
                <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                    <Panel header="预警信息挖掘" key="1" className="text-center">

                    </Panel>
                    <Panel header="进程挖掘" key="2" className="text-center">

                    </Panel>
                    <Panel header="进程占用资源挖掘" key="3" className="text-center">

                    </Panel>
                </Collapse>
            </div>

        );
    }
}
