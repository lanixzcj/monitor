/**
 * Created by lan on 17-3-15.
 */
import { createReducer } from '../utils';
import {
    LOAD_STRATEGY_REQUEST,
    LOAD_STRATEGY_SUCCESS,
    LOAD_STRATEGY_ERROR,

    CHANGE_DEVICE_STRATEGY_REQUEST,
    CHANGE_DEVICE_STRATEGY_SUCCESS,
    CHANGE_DEVICE_STRATEGY_ERROR
} from '../constants';
import {createConstantsWithNamedType} from '../constants'

const initialState = {
    data: {},
    isLoading: false,
};

export default createReducer(initialState, {
    [LOAD_STRATEGY_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true,
        });
    },
    [LOAD_STRATEGY_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: payload.data
        });
    },
    [LOAD_STRATEGY_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: {}
        });
    },
    [CHANGE_DEVICE_STRATEGY_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: true,
        });
    },
    [CHANGE_DEVICE_STRATEGY_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
        });
    },
    [CHANGE_DEVICE_STRATEGY_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
        });
    },
});

export function createReducerWithType(name = '') {
    const constants = createConstantsWithNamedType(name);
    return createReducer(initialState, {
        [constants.addRequest]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: true,
            });
        },
        [constants.addSuccess]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: false,
                data: payload.data
            });
        },
        [constants.addError]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: false,
                data: []
            });
        },
        [constants.deleteRequest]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: true,
            });
        },
        [constants.deleteSuccess]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: false,
                data: payload.data
            });
        },
        [constants.deleteError]: (state, payload) => {
            return Object.assign({}, state, {
                isLoading: false,
                data: []
            });
        }
    })
}