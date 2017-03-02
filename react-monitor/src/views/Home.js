import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MonTable from '../components/Home/Table';
// import ArticleModal from '../components/Home/Modal';
// import { tableActions, modalActions } from './HomeRedux';
import './Home.css';

// @connect(
//   state => ({
//     table: state.articles.table,
//     modal: state.articles.modal,
//   }),
//   dispatch => ({
//     tableActions: bindActionCreators(tableActions, dispatch),
//     modalActions: bindActionCreators(modalActions, dispatch)
//   })
// )
export default class ArticleCRUD extends Component {
  render() {
    return (
      <div>
        {/*<button onClick={this.props.modalActions.showModal}>新增文章</button>*/}
        <MonTable />

      </div>
    );
  }
}
