
export const LOAD_HOST_REQUEST = 'LOAD_HOST_REQUEST';
export const LOAD_HOST_SUCCESS = 'LOAD_HOST_SUCCESS';
export const LOAD_HOST_ERROR = 'LOAD_HOST_ERROR';

export const ADD_TRUSTED_HOST = 'ADD_TRUSTED_HOST';
export const REMOVE_TRUSTED_HOST = 'REMOVE_TRUSTED_HOST';

export const SHOW_DRAWER = 'SHOW_DRAWER';
export const HIDE_DRAWER = 'HIDE_DRAWER';
export const INIT_MONITOR_DATA = 'INIT_MONITOR_DATA';

export const LOAD_MONITOR_DATA_REQUEST = 'LOAD_MONITOR_DATA_REQUEST';
export const LOAD_MONITOR_DATA_SUCCESS = 'LOAD_MONITOR_DATA_SUCCESS';
export const LOAD_MONITOR_DATA_ERROR = 'LOAD_MONITOR_DATA_ERROR';


export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const INIT_STRATEGY_DATA = 'INIT_STRATEGY_DATA';

export const LOAD_STRATEGY_REQUEST = 'LOAD_STRATEGY_REQUEST';
export const LOAD_STRATEGY_SUCCESS = 'LOAD_STRATEGY_SUCCESS';
export const LOAD_STRATEGY_ERROR = 'LOAD_STRATEGY_ERROR';

export const CHANGE_DEVICE_STRATEGY_REQUEST = 'CHANGE_DEVICE_STRATEGY_REQUEST';
export const CHANGE_DEVICE_STRATEGY_SUCCESS = 'CHANGE_DEVICE_STRATEGY_SUCCESS';
export const CHANGE_DEVICE_STRATEGY_ERROR = 'CHANGE_DEVICE_STRATEGY_ERROR';

export function createConstantsWithNamedType(name = '') {
    return {
        addRequest: `ADD_${name}_REQUEST`,
        addSuccess: `ADD_${name}_SUCCESS`,
        addError: `ADD_${name}_ERROR`,
        deleteRequest: `DELETE_${name}_REQUEST`,
        deleteSuccess: `DELETE_${name}_SUCCESS`,
        deleteError: `DELETE_${name}_ERROR`,
    }
}