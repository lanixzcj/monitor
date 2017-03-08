import React from 'react';
import {Link} from 'react-router';
import {Nav, NavDropdown, NavItem, Navbar, MenuItem, Button} from 'react-bootstrap'


// class Nav extends React.Component {
//     render() {
//         return (
//             <nav>
//                 <Link to="/">Home</Link>
//             </nav>
//         );
//     }
// }
export default class MonNav extends React.Component {

    render() {
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
                    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>设置</MenuItem>
                        <MenuItem eventKey={3.2}>登出</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
}

