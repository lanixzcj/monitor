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
import {toastr} from 'react-redux-toastr'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

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
        // dispatch(showLoading());
        dispatch(loadStrategyRequest());
        return fetch(`${SERVER_URL}/api/v1/monitor/strategy/all/${host}`, {

        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(loadStrategySuccess(response));
                // dispatch(hideLoading());
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
                // dispatch(hideLoading());

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function changeDeviceRequest(data) {
    return {
        type: CHANGE_DEVICE_STRATEGY_REQUEST,
        payload: {
            data
        }
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

export function changeDeviceStrategy(host, deviceThreshold) {
    return (dispatch) => {
        dispatch(changeDeviceRequest(deviceThreshold));
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
                dispatch(changeDeviceSuccess(response));
                toastr.success('保存成功', `成功保存${host}设备阈值`);
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
                toastr.error('保存失败', '');

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function addRequest(name = '', host) {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.addRequest,
        payload : {
            host
        }
    }
}

export function addSuccess(name = '', data, host) {
    const constants = createConstantsWithNamedType(name);

    return {
        type: constants.addSuccess,
        payload : {
            data,
            host
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

export function deleteRequest(name = '', host) {
    const constants = createConstantsWithNamedType(name);
    return {
        type: constants.deleteRequest,
        payload : {
            host
        }
    }
}

export function deleteSuccess(name = '', data, host) {
    const constants = createConstantsWithNamedType(name);

    return {
        type: constants.deleteSuccess,
        payload : {
            data,
            host
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

export function addStrategy(name, host, strategy) {
    return (dispatch) => {
        dispatch(addRequest(name, host));
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
                dispatch(addSuccess(name, data, host));
                toastr.success('添加成功', `成功添加${host}安全策略`);
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
                toastr.error('添加失败', '');

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function removeStrategy(name, host, strategy_ids) {
    return (dispatch) => {
        dispatch(deleteRequest(name, host));
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
                dispatch(deleteSuccess(name, data, host));
                toastr.success('删除成功', `成功删除${host}安全策略`);
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
                toastr.error('删除失败', '');

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}