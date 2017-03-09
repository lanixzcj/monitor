import React from 'react';
import MonNav from './Nav';
import Drawer from './Drawer'
import ArticleModal from '../components/Home/MonitorModal';
import {tableActions, modalActions, drawerActions, monActions} from '../views/Home/HomeRedux';
import '../static/css/bootstrap.min.css'
import '../static/css/bootstrap-table.min.css'
import '../static/css/bootstrap-slider.min.css'

export default class Frame extends React.Component {
    render() {
        return (
            <div >

                <Drawer>

                    <MonNav />
                    <div className="container">
                        {this.props.children}
                    </div>
                </Drawer>
            </div>
        );
    }
}
