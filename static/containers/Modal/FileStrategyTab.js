import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import {Spin} from 'antd'
import StrategyTable from '../../components/StrategyTable'


const fileHeaders = [
    {field: 'file', name: '文件名', options: {pattern: /^\/.+[^\/]$/}},
    {field: 'permission', name: '权限', options: {pattern: /^[0-7]{3}$/}},
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

        this.state = {
            data: props.data,
        };
        this.initRender = true;
    }

    componentDidMount() {
        this.initRender = false;
    }

    onAddRow = (row, name) => {
        this.props.strategyActions.addStrategy('file', this.props.host, row)
    };

    onDeleteRow = (row, name) => {
        this.props.strategyActions.removeStrategy('file', this.props.host, row);
    };

    render() {
        let data = [];
        if (this.initRender) {
            data =  this.state.data;
        } else {
            const modified_data = this.props.fileStrategy.data;
            data = modified_data instanceof Array ? modified_data : this.table.getLocalData();
        }

        return (
            <StrategyTable ref={ref => this.table = ref} data={data} onAddRow={this.onAddRow}
                           onDeleteRow={this.onDeleteRow}
                           loading={this.props.fileStrategy.isLoading}
                           headers={ fileHeaders}/>
        );
    }
}
