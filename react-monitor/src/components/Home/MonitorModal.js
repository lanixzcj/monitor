import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {createForm} from 'redux-form-utils';
import formConfig from './Modal.config';
import Slider from './Slider'



// @createForm(formConfig)
export default class ArticleModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const {title, desc, date} = this.props.fields;
        return (
            <Modal show={this.props.visible} onHide={this.props.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.host}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="设备信息">
                            <ListGroupItem><strong>硬盘监控</strong></ListGroupItem>
                            <ListGroupItem >
                                <Slider ref={(ref) => {this.diskSlider = ref}} label="硬盘使用阈值:"
                                        min={0} max={100} step={1} defaultValue={50} units="GB"/>
                            </ListGroupItem>
                            <ListGroupItem><strong>CPU监控</strong></ListGroupItem>
                            <ListGroupItem >
                                <Slider ref={(ref) => {this.cpuSlider = ref}} label="CPU使用阈值:"
                                        min={0} max={100} step={1} defaultValue={50} units="%"/>
                            </ListGroupItem>
                            <ListGroupItem><strong>内存监控</strong></ListGroupItem>
                            <ListGroupItem >
                                <Slider ref={(ref) => {this.memSlider = ref}} label="内存使用阈值:"
                                        min={0} max={100} step={1} defaultValue={50} units="KB"/>
                            </ListGroupItem>
                            <ListGroupItem><strong>网络监控</strong></ListGroupItem>
                            <ListGroupItem >
                                <Slider ref={(ref) => {this.byteinSlider = ref}} label="下载阈值"
                                        min={0} max={100} step={1} defaultValue={50} units="KB"/>
                                <Slider ref={(ref) => {this.byteoutSlider = ref}} label="上传阈值"
                                        min={0} max={100} step={1} defaultValue={50} units="KB"/>
                            </ListGroupItem>
                        </Tab>
                        <Tab eventKey={2} title="进程">
                        </Tab>
                        <Tab eventKey={3} title="文件">
                        </Tab>
                        <Tab eventKey={4} title="移动介质">
                        </Tab>
                        <Tab eventKey={5} title="IP包">
                        </Tab>
                        <Tab eventKey={6} title="预警历史">
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">保存</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
