import React from 'react';
import { connect } from 'react-redux';

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
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div style={{margin: '0px 50px'}}>
                <MonitorModal />
                <MonTable {...this.props.modalActions} {...this.props.hostsActions}
                          {...this.props.drawerActions} hosts={this.props.hosts}/>
            </div>
        );
    }
}

