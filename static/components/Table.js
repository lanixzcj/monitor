import React, {Component, PropTypes} from 'react';
import { Table, Icon ,Dropdown, Button, Menu} from 'antd';
import '../styles/components/Table.css';




function renderStat(text, row, index) {
    const statType = {
        '0unsafe': '危险',
        '1online': '在线中',
        '2offline': '离线'
    };
    return <span className={columnClassNameFormat(text)}>{statType[text]}</span> ;
}

function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
    switch (fieldValue) {
        case '0unsafe':
            return 'text-danger';
        case '1online':
            return 'text-success';
        case '2offline':
            return 'text-warning';
        default:
            return ''
    }
}

export default class MonTable extends Component {
    static propTypes = {
        hosts: React.PropTypes.object,
        showDrawer: React.PropTypes.func,
        showModal: React.PropTypes.func,
        loadHosts: React.PropTypes.func,
    };

    static defaultProps = {
        hosts: []
    };

    constructor(props) {
        super(props);

        this.columns = [{
            title: 'ID/主机名',
            dataIndex: 'hostname',
            width: '16%',
        }, {
            title: '监控',
            dataIndex: 'monitor',
            width: '16%',
            render: this.renderMonitor,
        }, {
            title: '状态',
            dataIndex: 'stat',
            width: '16%',
            render: renderStat,
        }, {
            title: 'IP地址',
            dataIndex: 'ip',
            width: '16%',
        }, {
            title: 'MAC地址',
            dataIndex: 'mac_address',
            width: '16%',
        }, {
            title: '操作',
            dataIndex: 'operate',
            width: '16%',
            render: this.renderDropdown
        }];
    }

    renderMonitor = (text, row, index) => {
        return (
            (row.hostname == undefined || row.hostname.length == 0) ?
                <div> </div> :
                <a href="#" onClick= {
                    () => {
                        this.props.showDrawer(row.hostname);
                    }}>
                    <Icon type="area-chart"/>
                </a>
        );
    };

    renderDropdown = (text, row, index) => {
        const handleMenuClick = (e) => {
            switch (e.key) {
                case '1':
                    this.props.showModal(row.hostname);
                    break;
                case '2':
                    this.props.removeTrustedHost(row.mac_address);
                    break;
                case '3':
                    this.props.addTrustedHost(row.mac_address);
                    break;
                default: break;
            }
        };
        let menuItem = new Array();
        if (row.hostname !== undefined && row.hostname.length != 0) {
            menuItem.push(<Menu.Item key={`1`}>配置安全策略</Menu.Item>);
        }
        if (row.is_trusted) {
            menuItem.push(<Menu.Item key={`2`}>从信任列表中移除</Menu.Item>);
        } else {
            menuItem.push(<Menu.Item key={`3`}>加入信任列表</Menu.Item>);
        }
        const menu = <Menu onClick={handleMenuClick}>{menuItem}</Menu>;

        return (
            <Dropdown overlay={menu} key={`${index}`} >
                <Button style={{ marginLeft: 8 }}>
                更多 <Icon type="down" />
                </Button>
            </Dropdown>
        );
    };

    componentWillMount() {
        this.props.loadHosts();
    }

    render() {
        return (
            <Table columns={this.columns} loading={this.props.hosts.isLoading} dataSource={this.props.hosts.data} rowKey="mac_address">

            </Table>
        );
    }
}
