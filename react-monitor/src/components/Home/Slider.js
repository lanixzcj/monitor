/**
 * Created by lan on 17-3-8.
 */
import React, {Component, PropTypes} from 'react';
import {Image, ListGroup, ListGroupItem, ProgressBar, Row, Col} from 'react-bootstrap';
import './Slider.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


export default class MonSlider extends Component {
    constructor(props) {
        super(props);

        let defaultValue = this.props.defaultValue ? this.props.defaultValue: 0;
        this.state = {
            value: defaultValue,
        }
    }

    render() {
        const defaultProp = {
            min: 0,
            max: 100,
            step: 1,
            defaultValue: 0,
            label: "",
            units: ""
        };

        let {min, max, step, units, defaultValue, label} = {...defaultProp, ...this.props};
        return (
            <Row>
                <Col md={3}>{label}</Col>
                <Col md={5}>
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        defaultValue={defaultValue}
                        onChange={
                            (value) => {
                                this.setState({value: value});
                            }
                        }
                    />
                </Col>
                <Col md={4}>当前值为:{this.state.value}{units}</Col>
            </Row>
        );
    }
}
