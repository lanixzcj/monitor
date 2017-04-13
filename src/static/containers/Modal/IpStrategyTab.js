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

        this.state = {
            data: props.data,
        };
        this.initRender = true;
    }

    componentDidMount() {
        this.initRender = false;
    }

    onAddRow = (row, name) => {
        this.props.strategyActions.addStrategy('ip_packet', this.props.host, row)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy('ip_packet', this.props.host, row);
    };

    render() {
        let data = [];
        if (this.initRender) {
            data =  this.state.data;
        } else {
            const modified_data = this.props.ipStrategy.data;
            data = modified_data instanceof Array ? modified_data : this.table.getLocalData();
        }


        return (
            <StrategyTable ref={ref => this.table = ref} data={data} onAddRow={this.onAddRow}
                           onDeleteRow={this.onDeleteRow}
                           loading={this.props.ipStrategy.isLoading}
                      headers={ ipHeaders}/>
        );
    }
}
