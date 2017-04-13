/**
 * Created by lan on 17-3-7.
 */
import React, {Component, PropTypes} from 'react';
import { Progress } from 'antd';
import { SERVER_URL } from '../../utils/config';
import '../../styles/components/Table.css';
import { Collapse, Row, Col } from 'antd';
const Panel = Collapse.Panel;

export default class DeviceMonitor extends Component {
    constructor(props) {
        super(props);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.host != this.props.host || nextProps.time != this.props.time ) {
    //         this.props.loadMonitors(this.props.name, nextProps.host, nextProps.time);
    //     }
    // }

    render() {
        // console.log(this.props);
        let cpu = `${SERVER_URL}/api/v1/monitor/image/?h=${this.props.host}&m=cpu&r=${this.props.time}`;
        let mem = `${SERVER_URL}/api/v1/monitor/image/?h=${this.props.host}&m=mem&r=${this.props.time}`;
        let net = `${SERVER_URL}/api/v1/monitor/image/?h=${this.props.host}&m=net&r=${this.props.time}`;
        if (!this.props.data) {
            return (
                <div></div>
            )
        }
        let used = this.props.data.used ? this.props.data.used : 0;
        let total = this.props.data.total ? this.props.data.total : 100;
        let per = this.props.data.used_per ? this.props.data.used_per : 0;
        let label;
        if (used == undefined) {
            label = ""
        } else {
            label = `${used.toFixed(1)}GB/${total.toFixed(1)}GB`;
        }

        return (
            <div>
                <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
                    <Panel header="网络监控" key="1" className="text-center">
                        <img src={ net }/>
                    </Panel>
                    <Panel header="CPU监控" key="2" className="text-center">
                        <img src={ cpu}/>
                    </Panel>
                    <Panel header="内存监控" key="3" className="text-center">
                        <img src={ mem }/>
                    </Panel>
                    <Panel header="硬盘监控" key="4" className="text-center">
                        <Row>
                            <Col span={20}>
                                <Progress percent={per} status="active" format={() => label}/>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
            </div>

        );
    }
}
