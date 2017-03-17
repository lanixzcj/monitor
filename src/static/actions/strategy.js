/**
 * Created by lan on 17-3-15.
 */
import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOAD_STRATEGY_REQUEST,
    LOAD_STRATEGY_SUCCESS,
    LOAD_STRATEGY_ERROR,

    CHANGE_DEVICE_STRATEGY_REQUEST,
    CHANGE_DEVICE_STRATEGY_SUCCESS,
    CHANGE_DEVICE_STRATEGY_ERROR
} from '../constants';

export function loadStrategyRequest() {
    return {
        type: LOAD_STRATEGY_REQUEST,
    };
}

export function loadStrategySuccess(data) {
    return {
        type: LOAD_STRATEGY_SUCCESS,
        payload: {
            data
        }
    };
}

export function loadStrategyError(error, message) {
    return {
        type: LOAD_STRATEGY_ERROR,
        payload: {
            status: error,
            statusText: message
        }
    };
}


export function loadStrategy(host) {
    return (dispatch) => {
        dispatch(loadStrategyRequest());
        return fetch(`${SERVER_URL}/api/v1/monitor/strategy/all/${host}`, {

        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(loadStrategySuccess(response));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(loadStrategyError(401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(loadStrategyError(500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(loadStrategyError('Connection Error', 'An error occurred while sending your data!'));
                }

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function changeDeviceStrategy(host, deviceThreshold) {
    return (dispatch) => {
        return fetch(`${SERVER_URL}/api/v1/monitor/strategy/device/${host}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'threshold': deviceThreshold
            }),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
            })
            .catch((error) => {
                // if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                //     // Invalid authentication credentials
                //     return error.response.json().then((data) => {
                //         dispatch(loadStrategyError(401, data.non_field_errors[0]));
                //     });
                // } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                //     // Server side error
                //     dispatch(loadStrategyError(500, 'A server error occurred while sending your data!'));
                // } else {
                //     // Most likely connection issues
                //     dispatch(loadStrategyError('Connection Error', 'An error occurred while sending your data!'));
                // }
                //
                // return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}