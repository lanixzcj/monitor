/**
 * Created by lan on 17-3-15.
 */
import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOAD_HOST_REQUEST,
    LOAD_HOST_SUCCESS,
    LOAD_HOST_ERROR,

    ADD_TRUSTED_HOST,
    REMOVE_TRUSTED_HOST
} from '../constants';

export function loadHostRequest() {
    return {
        type: LOAD_HOST_REQUEST,

    };
}

export function loadHostSuccess(data) {
    return {
        type: LOAD_HOST_SUCCESS,
        payload: {
            data
        }
    };
}

export function loadHostError(error, message) {
    return {
        type: LOAD_HOST_ERROR,
        payload: {
            status: error,
            statusText: message
        }
    };
}

export function addTrustedHostSuccess(data) {
    return {
        type: ADD_TRUSTED_HOST,
        payload: {
            data
        }
    };
}

export function removeTrustedHostSuccess(data) {
    return {
        type: REMOVE_TRUSTED_HOST,
        payload: {
            data
        }
    };
}

export function addTrustedHost(mac_address) {
    return (dispatch) => {
        return fetch(`${SERVER_URL}/api/v1/monitor/trusted_hosts/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'mac': mac_address
            }),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(addTrustedHostSuccess(response));
            })
            .catch((error) => {
                // if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                //     // Invalid authentication credentials
                //     return error.response.json().then((data) => {
                //         dispatch(loadHostError(401, data.non_field_errors[0]));
                //     });
                // } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                //     // Server side error
                //     dispatch(loadHostError(500, 'A server error occurred while sending your data!'));
                // } else {
                //     // Most likely connection issues
                //     dispatch(loadHostError('Connection Error', 'An error occurred while sending your data!'));
                // }

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function removeTrustedHost(mac_address) {
    return (dispatch) => {
        return fetch(`${SERVER_URL}/api/v1/monitor/trusted_hosts/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                'mac': mac_address
            }),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(removeTrustedHostSuccess(response));
            })
            .catch((error) => {
                // if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                //     // Invalid authentication credentials
                //     return error.response.json().then((data) => {
                //         dispatch(loadHostError(401, data.non_field_errors[0]));
                //     });
                // } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                //     // Server side error
                //     dispatch(loadHostError(500, 'A server error occurred while sending your data!'));
                // } else {
                //     // Most likely connection issues
                //     dispatch(loadHostError('Connection Error', 'An error occurred while sending your data!'));
                // }

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function loadHosts() {
    return (dispatch) => {
        dispatch(loadHostRequest());
        return fetch(`${SERVER_URL}/api/v1/monitor/hosts/`, {

        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(loadHostSuccess(response));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(loadHostError(401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(loadHostError(500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(loadHostError('Connection Error', 'An error occurred while sending your data!'));
                }

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}
