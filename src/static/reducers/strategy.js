/**
 * Created by lan on 17-3-15.
 */
import { createReducer } from '../utils';
import {
    LOAD_STRATEGY_REQUEST,
    LOAD_STRATEGY_SUCCESS,
    LOAD_STRATEGY_ERROR,
} from '../constants';

const initialState = {
    data: {},
    isLoading: false,
    loaded: false,
};

export default createReducer(initialState, {
    [LOAD_STRATEGY_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true,
            loaded: false,
            visible: true,
        });
    },
    [LOAD_STRATEGY_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: payload.data
        });
    },
    [LOAD_STRATEGY_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: {}
        });
    },
});