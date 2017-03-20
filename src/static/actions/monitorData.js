/**
 * Created by lan on 17-3-15.
 */
import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOAD_MONITOR_DATA_REQUEST,
    LOAD_MONITOR_DATA_SUCCESS,
    LOAD_MONITOR_DATA_ERROR,

} from '../constants';

export function loadDataRequest() {
    return {
        type: LOAD_MONITOR_DATA_REQUEST,

    };
}

export function loadDataSuccess(data) {
    return {
        type: LOAD_MONITOR_DATA_SUCCESS,
        payload: {
            data
        }
    };
}

export function loadDataError(error, message) {
    return {
        type: LOAD_MONITOR_DATA_ERROR,
        payload: {
            status: error,
            statusText: message
        }
    };
}

export function loadAllMonitors(host, time='hour') {
    return (dispatch) => {
        dispatch(loadDataRequest());
        return fetch(`${SERVER_URL}/api/v1/monitor/monitor/all/${host}?r=${time}`, {

        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(loadDataSuccess(response));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(loadDataError(401, data.non_field_errors[0]));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(loadDataError(500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(loadDataError('Connection Error', 'An error occurred while sending your data!'));
                }

                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}
