/**
 * Created by lan on 17-3-15.
 */
import React, {Component, PropTypes}  from 'react';
import ReactDOM from 'react-dom';
import Sidebar from 'react-sidebar'
import SidebarContent from './DrawerContent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as drawerActions from '../../actions/drawer';

const styles = {
    contentHeaderMenuLink: {
        textDecoration: 'none',
        color: 'white',
        padding: 8,
    },
    content: {
        padding: '16px',
    },
};




@connect(
    state => ({
       drawer: state.drawer,
    }),
    dispatch => ({
        drawerActions: bindActionCreators(drawerActions, dispatch),
    })
)
export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: true,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: true,
            touchHandleWidth: 20,
            dragToggleDistance: 20,
            styles: styles,
        }
    }

    onSetOpen(open) {
        if (open) {
            this.props.drawerActions.showDrawer(this.props.host);
        } else {
            this.props.drawerActions.hideDrawer();
        }
    }

    render() {
        const sidebar = <SidebarContent />;

        const sidebarProps = {
            sidebar: sidebar,
            docked: this.state.docked,
            sidebarClassName: 'custom-sidebar-class',
            open: this.props.drawer.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: true,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen,
            styles: styles,
            props: this.props,
        };

        return (
            <Sidebar {...sidebarProps} >
                {this.props.children}
            </Sidebar>

        );
    }
}