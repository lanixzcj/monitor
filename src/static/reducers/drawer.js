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
    open: false,
    host: null,
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
});