import React, {Component, PropTypes} from 'react';
import {Modal, Button, Tab, Tabs} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {createForm} from 'redux-form-utils';
import formConfig from './Modal.config';

// @createForm(formConfig)
export default class ArticleModal extends Component {
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
                            <ReactBootstrapSlider
                                value={60}
                                step={7}
                                max={100}
                                min={1}
                                />
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
                    <Button onClick={this.props.hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
