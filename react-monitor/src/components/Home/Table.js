import React, { Component, PropTypes } from 'react';
// import { Table, Modal } from 'antd';
import { Table} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const columns = [{
  title: '标题',
  dataIndex: 'title',
  width: 100,
}, {
  title: '描述',
  dataIndex: 'desc',
  width: 400,
}, {
  title: '发布日期',
  dataIndex: 'date',
  width: 100,
}, {
  title: '操作',
  render(text, record) {
    return <a className="op-btn" onClick={this.handleDelete.bind(this, record)}>删除</a>;
  },
}];

export default class MonTable extends Component {
  componentDidMount() {

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
      <div>

        <Table columns={columns.map(c => c.render ? ({
          ...c,
          render: c.render.bind(this)
        }) : c)} dataSource={this.props.articles} />
      </div>
    );
  }
}
