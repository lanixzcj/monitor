import React from 'react';
import {Link} from 'react-router';
import {Nav, NavDropdown, NavItem, Navbar, MenuItem, Button} from 'react-bootstrap'
import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';

export default class MonNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: true,
            user: "",
            isAuthenticated: false
        };
    }

    componentWillMount() {
        fetch(`${SERVER_URL}/api/v1/monitor/user/`, {
            credentials: 'include',
        }).then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
            console.log(response);
            this.setState({
                fetching: false,
                user: response.user,
                isAuthenticated: response.isAuthenticated,
            })
        })
        .catch(() => {
            this.setState({
                fetching: false,
                user: "",
                isAuthenticated: false,
            })
        });
    }

    render() {
        let userDom = <NavItem href="/admin/login/?next=/">登录</NavItem>;
        if (this.state.user && this.state.isAuthenticated && !this.state.fetching) {
            userDom = <NavDropdown eventKey={3} title={this.state.user} id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1} href="/admin/">设置</MenuItem>
                        <MenuItem eventKey={3.2} href="/admin/logout/">登出</MenuItem>
                    </NavDropdown>;
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

