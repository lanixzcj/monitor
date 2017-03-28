/**
 * Created by lan on 17-3-28.
 */
import React, {Component, PropTypes} from 'react';

import { Form, Modal, Tabs, Button, Input } from 'antd';
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


export default Form.create()(
    (props) => {
        const {columns} = props;
        console.log(columns);
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;
        return (
            <div>

                <Modal
                    visible={props.visible}
                    title="添加"
                    onCancel={props.onCancel}
                    onOk={props.onAdd}
                >
                    <Form layout="vertical">
                        {
                            columns.map((column, i) => {
                                const {field, name} = column;
                                const error = isFieldTouched(field) && getFieldError(field);
                                return <FormItem key={field} validateStatus={error ? 'error' : ''}>
                                    {getFieldDecorator(field, {
                                        rules: [{required: true, message: `请输入${name}`}]
                                    })(
                                        <Input placeholder={name}/>
                                    )}
                                </FormItem>
                            })
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
)
class InsertForm extends Component {
    render() {
        const {columns} = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        return (
            <Form layout="vertical">
                {
                    columns.map((column, i) => {
                        const {field, name} = column;
                        const error = isFieldTouched(field) && getFieldError(field);
                        console.log(this)
                        return <FormItem key={field} validateStatus={error ? 'error' : ''}>
                            {getFieldDecorator(field, {
                                rules: [{required: true, message: `请输入${name}`}]
                            })(
                                <Input placeholder={name}/>
                            )}
                        </FormItem>
                    })
                }
            </Form>
        );
    }
}

class MonitorModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <Modal
                    visible={this.props.visible}
                    title="添加"
                    onCancel={this.props.onCancle}
                >
                    <InsertForm {...this.props}/>

                </Modal>

            </div>


        );
    }
}
