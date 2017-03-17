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

const ipHeaders = {
    rule: {
        name: '规则链',
        editable: {
            type: 'select',
            options: {values: [ 'INPUT', 'FORWARD', 'OUTPUT']}
        }
    },
    ip: 'IP',
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
    static contextTypes = {
        showAlert: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    onAddRow = (row, name) => {
        this.props.strategyActions.addStrategy('ip_packet', this.props.host, row, this.context.showAlert)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy('ip_packet', this.props.host, row, this.context.showAlert);
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
