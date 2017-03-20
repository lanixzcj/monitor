import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';

import './styles/main.scss';
import './styles/bootstrap.min.css'
import './styles/bootstrap-table.min.css'
import './styles/bootstrap-slider.min.css'
import MonNav from './components/Nav'
import Drawer from './containers/Drawer/index'
import LoadingBar from 'react-redux-loading-bar'


const loadingStyle = {
    zIndex: 99999999
};

export default class App extends React.Component {
    render() {

        return (
            <div>
                <LoadingBar style={loadingStyle} />
                <Drawer>
                    <MonNav/>

                    <div>
                        {this.props.children}
                    </div>
                </Drawer>
            </div>


        );
    }
}
