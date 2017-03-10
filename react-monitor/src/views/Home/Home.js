import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MonTable from '../../components/Home/Table';
import MonitorModal from '../../components/Home/MonitorModal';
import {tableActions, modalActions, drawerActions, monActions} from './HomeRedux';
import './Home.css';
import Sidebar from '../../layouts/Drawer';
import ModalContent from '../Modal/ModalContent'


@connect(
    state => ({
        table: state.hosts.table,
        drawer: state.hosts.drawer,
        modal: state.hosts.modal,
    }),
    dispatch => ({
        tableActions: bindActionCreators(tableActions, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
        drawerActions: bindActionCreators(drawerActions, dispatch),
    })
)
export default class Home extends Component {

    render() {
        return (
            <div>
                <MonitorModal {...this.props.modal} {...this.props.modalActions} >

                </MonitorModal>
                <MonTable showDrawer={this.props.drawerActions.showDrawer}
                          showModal={this.props.modalActions.showModal}
                          {...this.props.table} {...this.props.tableActions} />
            </div>
        );
    }
}
