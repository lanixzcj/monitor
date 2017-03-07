/**
 * Created by lan on 17-3-7.
 */
import React, {Component, PropTypes} from 'react';
// import { Table, Modal } from 'antd';
import {Image, ListGroup, ListGroupItem, ProgressBar} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './Table.css';


export default class DeviceMonitor extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.host != this.props.host || nextProps.time != this.props.time ) {
            this.props.loadArticles(this.props.name, nextProps.host, nextProps.time);
        }
    }

    render() {
        console.log(this.props);
        let url = `http://192.168.3.106:8000/image/?h=${this.props.host}&m=cpu&r=${this.props.time}`;
        return (
            <ListGroup>
                <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ url }/>
                </ListGroupItem>
                <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ url }/>
                </ListGroupItem>
                <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                <ListGroupItem className='text-center'>
                    <Image src={ url }/>
                </ListGroupItem>
                <ListGroupItem><strong>磁盘使用率</strong></ListGroupItem>
                <ListGroupItem >
                    <ProgressBar active now={60} label='ss'/>
                </ListGroupItem>
            </ListGroup>


        );
    }
}
