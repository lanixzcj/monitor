import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import './styles/main.scss';
import MonNav from './components/Nav'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
import './styles/components/Sider.css'
import Drawer from './containers/Drawer/index'

const loadingStyle = {
    zIndex: 99999999
};
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
        backgroundColor: '#fff'
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
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    dragHandle: {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        bottom: 0,
    },
};

export default class App extends React.Component {


    render() {

        return (
            <div>

                {/*<Drawer>*/}
                    {/*<MonNav/>*/}

                    {/*<div>*/}
                        {/*{this.props.children}*/}
                    {/*</div>*/}

                    {/*<LoadingBar style={loadingStyle} />*/}
                {/*</Drawer>*/}
                <Layout id="monitor-sider" style={defaultStyles.root}>
                    <Drawer></Drawer>
                    <Layout style={defaultStyles.content} >
                        <Header className="header" style={{ background: '#fff', padding: 0 }} >
                            <MonNav/>
                        </Header>
                        <Content style={{ background: '#fff'}}>
                            {this.props.children}
                        </Content>
                    </Layout>


                </Layout>
            </div>


        );
    }
}
