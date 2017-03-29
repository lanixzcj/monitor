import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import StrategyTable from '../../components/StrategyTable'


const ipHeaders = [
    {field: 'rule', name: '规则链', type: 'select',
        options: {values: ['INPUT', 'FORWARD', 'OUTPUT']}},
    {field: 'ip', name: 'IP',
        options: {pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/}},
];


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
