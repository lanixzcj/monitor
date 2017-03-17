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
import {createConstantsWithNamedType} from '../constants'

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

export function changeDeviceRequest() {
    return {
        type: CHANGE_DEVICE_STRATEGY_REQUEST,
    };
}

export function changeDeviceSuccess(data) {
    return {
        type: CHANGE_DEVICE_STRATEGY_SUCCESS,
        payload: {
            data
        }
    };
}

export function changeDeviceError(error, message) {
    return {
        type: CHANGE_DEVICE_STRATEGY_ERROR,
        payload: {
            status: error,
            statusText: message
        }
    }; 
}

export function changeDeviceStrategy(host, deviceThreshold, showAlert) {
    return (dispatch) => {
        dispatch(changeDeviceRequest());
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
                dispatch(changeDeviceSuccess());
                showAlert(true, '保存成功');
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(changeDeviceError(401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(changeDeviceError(500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(changeDeviceError('Connection Error', 'An error occurred while sending your data!'));
                }

                showAlert(false, '保存失败');
                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function addRequest(name = '') {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.addRequest,
    }
}

export function addSuccess(name = '', data) {
    const constants = createConstantsWithNamedType(name);

    return {
        type: constants.addSuccess,
        payload : {
            data
        }
    }
}

export function addError(name = '', error, message) {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.addError,
        payload: {
            status: error,
            statusText: message
        }
    }
}

export function deleteRequest(name = '') {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.deleteRequest,
    }
}

export function deleteSuccess(name = '', data) {
    const constants = createConstantsWithNamedType(name);

    return {
        type: constants.deleteSuccess,
        payload : {
            data
        }
    }
}

export function deleteError(name = '', error, message) {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.deleteError,
        payload: {
            status: error,
            statusText: message
        }
    }
}

export function addStrategy(name, host, strategy, showAlert) {
    return (dispatch) => {
        dispatch(addRequest(name));
        return fetch(`${SERVER_URL}/api/v1/monitor/strategy/${name}/${host}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                strategy
            ),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((data) => {
                dispatch(addSuccess(name, data));
                showAlert(true, '添加成功');
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(addError(name, 401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(addError(name, 500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(addError(name, 'Connection Error', 'An error occurred while sending your data!'));
                }
                showAlert(true, '添加失败');

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function removeStrategy(name, host, strategy_ids, showAlert) {
    return (dispatch) => {
        dispatch(deleteRequest(name));
        return fetch(`${SERVER_URL}/api/v1/monitor/strategy/${name}/${host}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                strategy_ids
            ),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((data) => {
                dispatch(deleteSuccess(name, data));
                showAlert(true, '删除成功');
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(deleteError(name, 401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(deleteError(name, 500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(deleteError(name, 'Connection Error', 'An error occurred while sending your data!'));
                }
                showAlert(true, '删除失败');

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}