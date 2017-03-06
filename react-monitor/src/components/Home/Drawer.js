/**
 * Created by lan on 3/5/17.
 */
import React, {Component, PropTypes}  from 'react';
import ReactDOM from 'react-dom';
var Sidebar = require('react-sidebar').default;
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';
import MonNav from '../../layouts/Nav';

const styles = {
    contentHeaderMenuLink: {
        textDecoration: 'none',
        color: 'white',
        padding: 8,
    },
    root: {
        position: 'absolute',
        top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        overflow: 'hidden',
    },
    content: {
        padding: '16px',
    },
};

const App = React.createClass({
    getInitialState() {
        return {
            docked: false,
            open: true,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: true,
            touchHandleWidth: 20,
            dragToggleDistance: 20,
            styles: styles,
        };
    },

    onSetOpen(open) {
        if (open) {
            this.props.showDrawer();
        } else {
            this.props.hideDrawer();
        }
    },

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    },

    renderPropCheckbox(prop) {
        const toggleMethod = (ev) => {
            const newState = {};
            newState[prop] = ev.target.checked;
            this.setState(newState);
        };

        return (
            <p key={prop}>
                <input type="checkbox" onChange={toggleMethod} checked={this.state[prop]} id={prop} />
                <label htmlFor={prop}> {prop}</label>
            </p>);
    },

    renderPropNumber(prop) {
        const setMethod = (ev) => {
            const newState = {};
            newState[prop] = parseInt(ev.target.value, 10);
            this.setState(newState);
        };

        return (
            <p key={prop}>
                {prop} <input type="number" onChange={setMethod} value={this.state[prop]} />
            </p>);
    },

    render() {
        const sidebar = <SidebarContent />;


        const sidebarProps = {
            sidebar: sidebar,
            docked: this.state.docked,
            sidebarClassName: 'custom-sidebar-class',
            open: this.props.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: true,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen,
            styles: styles,
        };

        return (
            <Sidebar {...sidebarProps} >
                {this.props.children}
            </Sidebar>

        );
    },
});

export default App;
