import React from 'react';
import MonNav from './Nav';
import Sidebar from '../components/Home/Drawer'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {drawerActions, monActions} from '../views/HomeRedux';


@connect(
    state => ({
        drawer: state.articles.drawer,
        ipPacket: state.articles.ipPacket,
        fileInfo: state.articles.fileInfo,
    }),
    dispatch => ({
        drawerActions: bindActionCreators(drawerActions, dispatch),
        monActions: bindActionCreators(monActions, dispatch),
    })
)

export default class Frame extends React.Component {
    render() {
        return (
            <div >
                <Sidebar {...this.props} {...this.props} >
                    <MonNav />
                    <div className="container">
                        {this.props.children}
                    </div>
                </Sidebar>
            </div>
        );
    }
}
