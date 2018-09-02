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
    CHANGE_DEVICE_STRATEGY_ERROR,

    INIT_STRATEGY_DATA,
} from '../constants';
import {createConstantsWithNamedType} from '../constants'

const initialState = {
    data: null,
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
        let data = state.data;
        if (data != null) {
            data.device = payload.data;
        }
        return Object.assign({}, state, {
            isLoading: false,
            data: data,
        });
    },
    [CHANGE_DEVICE_STRATEGY_ERROR]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
        });
    },
    [INIT_STRATEGY_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            isLoading: false,
            data: null
        });
    },
});

const initialStateStrategy = {
    host: null,
    data: null,
    isLoading: false,
};

export function createReducerWithType(name = '') {
    const constants = createConstantsWithNamedType(name);
    return createReducer(initialStateStrategy, {
        [constants.addRequest]: (state, payload) => {
            return Object.assign({}, state, {
                host: payload.host,
                isLoading: true,
            });
        },
        [constants.addSuccess]: (state, payload) => {
            return Object.assign({}, state, {
                host: payload.host,
                isLoading: false,
                data: payload.data
            });
        },
        [constants.addError]: (state, payload) => {
            return Object.assign({}, state, {
                host: null,
                isLoading: false,
                data: null
            });
        },
        [constants.deleteRequest]: (state, payload) => {
            return Object.assign({}, state, {
                host: payload.host,
                isLoading: true,
            });
        },
        [constants.deleteSuccess]: (state, payload) => {
            return Object.assign({}, state, {
                host: payload.host,
                isLoading: false,
                data: payload.data
            });
        },
        [constants.deleteError]: (state, payload) => {
            return Object.assign({}, state, {
                host: null,
                isLoading: false,
                data: null
            });
        },
        [INIT_STRATEGY_DATA]: (state, payload) => {
            return Object.assign({}, state, {
                host: null,
                isLoading: false,
                data: null
            });
        },
    })
}