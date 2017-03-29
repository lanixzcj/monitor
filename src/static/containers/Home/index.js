import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import './style.scss';
import { bindActionCreators } from 'redux';
import MonTable from '../../components/Table'
import MonitorModal from '../Modal/index'
import * as hostsActions from '../../actions/hosts';
import * as drawerActions from '../../actions/drawer'
import * as modalActions from '../../actions/modal'


@connect(
    state => ({
        hosts: state.hosts,
    }),
    dispatch => ({
        hostsActions: bindActionCreators(hostsActions, dispatch),
        drawerActions: bindActionCreators(drawerActions, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch)
    })
)
export default class HomeView extends React.Component {
    static propTypes = {
        statusText: React.PropTypes.string,
        userName: React.PropTypes.string
    };

    static defaultProps = {
        statusText: '',
        userName: ''
    };

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div className="container">
                <MonitorModal />
                <MonTable {...this.props.modalActions} {...this.props.hostsActions}
                          {...this.props.drawerActions} hosts={this.props.hosts}/>
            </div>
        );
    }
}

