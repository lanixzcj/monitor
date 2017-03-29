/**
 * Created by lan on 17-3-8.
 */
import React, {Component, PropTypes} from 'react';
import '../styles/components/Slider.css';
import { Slider, Row, Col } from 'antd';
import 'rc-slider/assets/index.css';


export default class MonSlider extends Component {
    constructor(props) {
        super(props);
        const value = this.props.value === undefined ? 0 : this.props.value;

        this.state = {
            value: value,
            isDragging: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.isDragging && !nextProps.isLoading) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    render() {
        const defaultProp = {
            min: 0,
            max: 100,
            step: 1,
            label: "",
            units: ""
        };

        let {min, max, step, units, label} = {...defaultProp, ...this.props};
        return (
            <Row>
                <Col span={6}>{label}</Col>
                <Col span={10}>
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={this.state.value}
                        onChange={
                            (value) => {
                                this.setState({
                                    value: value,
                                    isDragging: true
                                });
                            }
                        }
                        onAfterChange={()=>{this.setState({isDragging: false})}}
                    />
                </Col>
                <Col span={8}>当前值为:{this.state.value}{units}</Col>
            </Row>
        );
    }
}
