/**
 * Created by lan on 17-3-7.
 */
import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Image, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { SERVER_URL } from '../../utils/config';
import '../../styles/components/Table.css';


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
            <ListGroup>
                <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ net }/>
                </ListGroupItem>
                <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ cpu}/>
                </ListGroupItem>
                <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ mem }/>
                </ListGroupItem>
                <ListGroupItem><strong>磁盘使用率</strong></ListGroupItem>
                <ListGroupItem >
                    <Row>
                        <Col md={8}>
                            <ProgressBar active now={per} label={`${per}%`}/>
                        </Col>
                        <Col md={4}>
                            {label}
                        </Col>
                    </Row>

                </ListGroupItem>
            </ListGroup>


        );
    }
}
