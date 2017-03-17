/**
 * Created by lan on 17-3-15.
 */
import { createReducer } from '../utils';
import {
    SHOW_DRAWER,
    HIDE_DRAWER,

    LOAD_MONITOR_DATA_REQUEST,
    LOAD_MONITOR_DATA_SUCCESS,
    LOAD_MONITOR_DATA_ERROR,

    CHANGE_TIME_RANGE
} from '../constants';

const initialState = {
    data: {},
    isLoading: false,
    loaded: false,
    open: false,
    host: null,
    time: 'hour',
};

export default createReducer(initialState, {
    [SHOW_DRAWER]: (state, payload) => {
        return Object.assign({}, state, {
            open: true,
            host: payload.host
        });
    },
    [HIDE_DRAWER]: (state, payload) => {
        return Object.assign({}, state, {
            open: false,
        });
    },
    [LOAD_MONITOR_DATA_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true,
            loaded: false,
        });
    },
    [LOAD_MONITOR_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: payload.data
        });
    },
    [LOAD_MONITOR_DATA_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: {}
        });
    },
    [CHANGE_TIME_RANGE]: (state, payload) => {
        return Object.assign({}, state, {
            time: payload.time
        });
    },
});