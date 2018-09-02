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

    CHANGE_TIME_RANGE,

    INIT_MONITOR_DATA,
} from '../constants';

const initialState = {
    data: null,
    isLoading: false,
    open: false,
    host: null,
};

export default createReducer(initialState, {
    [LOAD_MONITOR_DATA_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true,
        });
    },
    [LOAD_MONITOR_DATA_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: payload.data
        });
    },
    [LOAD_MONITOR_DATA_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: {}
        });
    },
    [INIT_MONITOR_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: null,
            host: null,
        });
    },
});