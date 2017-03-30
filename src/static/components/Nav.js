import React from 'react';
import {Link} from 'react-router';
import { Menu, Icon ,Button, Dropdown, Spin} from 'antd';
import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import '../styles/components/Nav.css'


export default class MonNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
            user: "",
            isAuthenticated: false
        };
    }

    componentWillMount() {
        this.setState({
            fetching: true,
        });
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
        let userDom = <a href="/admin/login/?next=/"><Button >登录</Button></a>;
        if (this.state.user && this.state.isAuthenticated && !this.state.fetching) {
            const menu = (
                <Menu className="setting-menu">
                    <Menu.Item>
                        <a  href="/admin/">设置</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a href="/admin/logout/">登出</a>
                    </Menu.Item>
                </Menu>
            );
            userDom = <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link setting" href="#">
                                {this.state.user} <Icon type="down" />
                            </a>
                        </Dropdown>;
        }

        return (
            <div style={{padding: '0px 50px'}}>
                <div className="pullLeft">
                    <Link to="/" className="logo">监控平台 </Link>
                </div>
                <Menu
                    mode="horizontal"
                    style={{float: 'left'}}
                >
                    <Menu.Item key="home">
                        <Link to="/">首页</Link>
                    </Menu.Item>
                </Menu>

                <div className="pullRight">
                    <Spin spinning={this.state.fetching}>
                        {userDom}
                    </Spin>
                </div>

            </div>
        );
    }
}

