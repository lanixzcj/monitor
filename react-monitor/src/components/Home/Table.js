import React, { Component, PropTypes } from 'react';
// import { Table, Modal } from 'antd';
import { Table} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var products = [{
    id: 1,
    name: "Product1",
    price: 120
}, {
    id: 2,
    name: "Product2",
    price: 80
}];


export default class MonTable extends Component {
  componentDidMount() {
      this.props.loadArticles();
  }

  handleDelete(record) {
    // Modal.confirm({
    //   title: '提示',
    //   content: '确认要删除该文章吗？'
    // }).then(() => {
    //   this.props.deleteArticle(record);
    // });
  }

  render() {
    return (
        <BootstrapTable data={products} options={ { noDataText: 'This is custom text sfor empty data' } }>
          <TableHeaderColumn dataField='id' isKey={ true }>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
          <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
