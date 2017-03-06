import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MonTable from '../components/Home/Table';
import ArticleModal from '../components/Home/Modal';
import {tableActions, modalActions, drawerActions} from './HomeRedux';
import './Home.css';
import Sidebar from '../components/Home/Drawer';


@connect(
    state => ({
        table: state.articles.table,
        modal: state.articles.modal,
        drawer: state.articles.drawer,

    }),
    dispatch => ({
        tableActions: bindActionCreators(tableActions, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
        drawerActions: bindActionCreators(drawerActions, dispatch)
    })
)
export default class ArticleCRUD extends Component {
    render() {
        return (
            <div>
                    <MonTable showDrawer={this.props.drawerActions.showDrawer} {...this.props.table} {...this.props.tableActions} />
            </div>
        );
    }
}
