/**
 * Created by lan on 17-3-15.
 */
import { createReducer } from '../utils';
import {
    LOAD_HOST_REQUEST,
    LOAD_HOST_SUCCESS,
    LOAD_HOST_ERROR,

    ADD_TRUSTED_HOST,
    REMOVE_TRUSTED_HOST
} from '../constants';

const initialState = {
    data: null,
    isLoading: false,
    loaded: false,
};

export default createReducer(initialState, {
    [LOAD_HOST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true
        });
    },
    [LOAD_HOST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: payload.data
        });
    },
    [ADD_TRUSTED_HOST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: payload.data
        });
    },
    [REMOVE_TRUSTED_HOST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: payload.data
        });
    },
    [LOAD_HOST_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            loaded: true,
            data: []
        });
    }
});