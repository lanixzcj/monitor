import React from 'react';
import MonNav from './Nav';
import Sidebar from '../components/Home/Drawer'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {drawerActions} from '../views/HomeRedux';


@connect(
    state => ({
        drawer: state.articles.drawer,
    }),
    dispatch => ({
        drawerActions: bindActionCreators(drawerActions, dispatch)
    })
)

export default class Frame extends React.Component {
  render() {
    return (
      <div >
          <Sidebar {...this.props.drawer} {...this.props.drawerActions} >
              <MonNav />
            <div className="container">
              {this.props.children}
            </div>
          </Sidebar>
      </div>
    );
  }
}
