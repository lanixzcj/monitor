/**
 * Created by lan on 17-3-28.
 */
import React, {Component, PropTypes} from 'react';

import { Form, Modal, Tabs, Button, Input, Select } from 'antd';
const Option = Select.Option;
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


const defaultProps = {
    type: 'input',
    options: {
        values: []
    }
};

function createEditor(type, options, placeholder) {
    if (type === 'input') {
        return <Input placeholder={placeholder}/>
    } else if (type === 'select') {
        const values = options.values;
        const selectOptions = values.map((value, i) => {
            return <Option key={value} value={value}>{value}</Option>
        });

        return (
            <Select placeholder={placeholder}>
                {selectOptions}
            </Select>
        )
    }
}

export default Form.create()(
    (props) => {
        const {columns} = props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;
        return (
            <div>
                <Modal
                    visible={props.visible}
                    title="添加"
                    onCancel={props.onCancel}
                    onOk={props.onAddRow}
                >
                    <Form layout="vertical">
                        {
                            columns.map((column, i) => {
                                const {field, name, type, options} = {...defaultProps, ...column};
                                const pattern = options.pattern;
                                const editor = createEditor(type, options, name);
                                return<FormItem key={field} >
                                    {getFieldDecorator(field, {
                                        rules: [{required: true, message: `请输入${name}`},
                                            pattern ?
                                                {pattern: pattern, message: `请输入正确的${name}`} :
                                                {}]
                                    })(
                                        editor
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
