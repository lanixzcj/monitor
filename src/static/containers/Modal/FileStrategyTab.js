import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as strategyActions from '../../actions/strategy';
import {Spin} from 'antd'
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
            <Spin spinning={this.props.fileStrategy.isLoading}>
                <StrategyTable data={files} onAddRow={this.onAddRow}
                               onDeleteRow={this.onDeleteRow}
                               headers={ fileHeaders}/>
            </Spin>
        );
    }
}
