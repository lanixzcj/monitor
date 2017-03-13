import React from 'react';
import {Link} from 'react-router';
import {Nav, NavDropdown, NavItem, Navbar, MenuItem, Button} from 'react-bootstrap'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {userActions} from '../views/Home/HomeRedux';

@connect(
    state => ({
        user: state.hosts.user,
    }),
    dispatch => ({
        userActions: bindActionCreators(userActions, dispatch),
    })
)
export default class MonNav extends React.Component {
    componentDidMount() {
        this.props.userActions.getUser();
    }

    render() {
        let userDom;
        if (this.props.user.user && this.props.user.is_authenticated) {
            userDom = <NavDropdown eventKey={3} title={this.props.user.user} id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>设置</MenuItem>
                        <MenuItem eventKey={3.2}>登出</MenuItem>
                    </NavDropdown>;
        } else {
            userDom = <Button href="ww">登录</Button>
        }

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">网络监控平台</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">首页</NavItem>
                </Nav>
                <Nav pullRight>
                    {userDom}
                </Nav>
            </Navbar>
        );
    }
}

