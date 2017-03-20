import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import Slider from '../../components/Slider'
import './Modal.css'
import AlertContainer from 'react-alert';
import MonTable from '../../components/MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'
import DeviceTab from './DeviceStrategyTab'
import StrategyTable from '../../components/StrategyTable'


function ipValidator(value, row) {
    const ip =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;

    if (ip.test(value)) {
        return true
    } else {
        return '请输入正确的ip';
    }
}

const ipHeaders = {
    rule: {
        name: '规则链',
        editable: {
            type: 'select',
            options: {values: [ 'INPUT', 'FORWARD', 'OUTPUT']}
        }
    },
    ip: {
        name: 'IP',
        editable: {
            validator: ipValidator,
        }
    },
};


@connect(
    state => ({
        ipStrategy: state.ipStrategy
    }),
    dispatch => ({
        strategyActions: bindActionCreators(strategyActions, dispatch),
    })
)
export default class MonitorModal extends Component {

    constructor(props) {
        super(props);
    }

    onAddRow = (row, name) => {
        this.props.strategyActions.addStrategy('ip_packet', this.props.host, row)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy('ip_packet', this.props.host, row);
    };

    render() {
        let files = this.props.data;
        const data = this.props.ipStrategy.data;
        files = data instanceof Array && data.length != 0
            ? data : files;
        return (
            <StrategyTable data={files} onAddRow={this.onAddRow}
                           onDeleteRow={this.onDeleteRow}
                      headers={ ipHeaders}/>
        );
    }
}
