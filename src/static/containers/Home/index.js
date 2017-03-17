import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import './style.scss';
import reactLogo from './images/react-logo.png';
import reduxLogo from './images/redux-logo.png';
import AlertContainer from 'react-alert';
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

    static childContextTypes = {
        showAlert: React.PropTypes.func,
    };

    getChildContext() {
        return {
            showAlert: this.showAlert,
        }
    }

    constructor(props) {
        super(props);

        this.alertOptions = {
            offset: 14,
            position: 'bottom right',
            theme: 'dark',
            time: 5000,
            transition: 'scale'
        };

    }

    showAlert = (result, message) => {
        result ? this.msg.show(message, {
                time: 2000,
                type: 'success',
            }) : this.msg.show(message, {
                time: 2000,
                type: 'error',
            })
    };



    render() {

        return (
            <div className="container">
                <AlertContainer ref={ref => this.msg = ref} {...this.alertOptions} />
                <MonitorModal />

                <MonTable {...this.props.modalActions} {...this.props.hostsActions} {...this.props.drawerActions} hosts={this.props.hosts}/>
            </div>
        );
    }
}

