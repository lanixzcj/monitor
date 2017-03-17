/**
 * Created by lan on 17-3-15.
 */
import { createReducer } from '../utils';
import {
    SHOW_MODAL,
    HIDE_MODAL,
} from '../constants';

const initialState = {
    visible: false,
    host: null,
};

export default createReducer(initialState, {
    [SHOW_MODAL]: (state, payload) => {
        return Object.assign({}, state, {
            visible: true,
            host: payload.host
        });
    },
    [HIDE_MODAL]: (state, payload) => {
        return Object.assign({}, state, {
            visible: false,
        });
    },
});