/**
 * Created by lan on 17-3-26.
 */
import React, {Component, PropTypes}  from 'react';
import ReactDOM from 'react-dom';
import SidebarContent from './DrawerContent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as drawerActions from '../../actions/drawer';
import * as monitorActions from '../../actions/monitorData';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const {Sider } = Layout;
const defaultStyles = {
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    sidebar: {
        zIndex: 2,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        overflowY: 'auto',
        backgroundColor: 'white'
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
    },
    overlay: {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity .3s ease-out, visibility .3s ease-out',
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    dragHandle: {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        bottom: 0,
    },
};
@connect(
    state => ({
        drawer: state.drawer,
    }),
    dispatch => ({
        drawerActions: bindActionCreators(drawerActions, dispatch),
        monitorActions: bindActionCreators(monitorActions, dispatch),
    })
)
export default class Drawer extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        collapsed: true,
    };
    overClick = () => {
        if (this.props.drawer.open) {
            this.props.drawerActions.hideDrawer();
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawer.host != this.props.drawer.host) {
            this.props.monitorActions.loadAllMonitors(nextProps.drawer.host,
                this.content.getWrappedInstance().state.time);
        }
    }

    render() {
        const overlayStyle = {...defaultStyles.overlay};
        if (this.props.drawer.open) {
            overlayStyle.opacity = 1;
            overlayStyle.visibility = 'visible';
        }

        return (
            <div>
                <Sider
                    collapsible
                    collapsed={!this.props.drawer.open}
                    trigger={null}
                    width={750}
                    collapsedWidth={0}
                    style={defaultStyles.sidebar}
                >
                    <SidebarContent ref={(ref) => this.content = ref} host={this.props.drawer.host}/>
                </Sider>
                <div style={overlayStyle} onClick={this.overClick}></div>
            </div>
        );
    }
}