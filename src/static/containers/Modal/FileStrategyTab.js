import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import Slider from '../../components/Slider'
import '../../styles/components/Modal.css'
import AlertContainer from 'react-alert';
import MonTable from '../../components/MonitorTable'
import ReactModal from 'react-modal'
import {InsertModalFooter, InsertModalHeader} from 'react-bootstrap-table'
import DeviceTab from './DeviceStrategyTab'
import StrategyTable from '../../components/StrategyTable'


const fileHeaders = [
    {field: 'file', name: '文件名'},
    {field: 'permission', name: '权限'},
];


@connect(
    state => ({
        fileStrategy: state.fileStrategy
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
        this.props.strategyActions.addStrategy('file', this.props.host, row)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy('file', this.props.host, row);
    };

    render() {
        let files = this.props.data;
        const data = this.props.fileStrategy.data;
        files = data instanceof Array && data.length != 0
            ? data : files;
        return (
            <StrategyTable data={files} onAddRow={this.onAddRow}
                           onDeleteRow={this.onDeleteRow}
                      headers={ fileHeaders}/>
        );
    }
}
