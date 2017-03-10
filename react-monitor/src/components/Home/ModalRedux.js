import config from './Modal.config';
import {bindRedux} from 'redux-form-utils';

const {state: formState, reducer: formReducer} = bindRedux(config);

const initialState = {
    saved: false,
    result: true,
    visible: false,
    host: '',
    deviceStrategy: {},
    loading: true,
    error: false,
    ...formState,
};

export function changeDeviceStrategy(host, deviceThreshold) {
    return {
        url: `http://192.168.3.106:8000/strategy/device/${host}`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'threshold': deviceThreshold
        }),
        types: [`CHANGE_DEVICE`, `CHANGE_DEVICE_SUCCESS`, `CHANGE_DEVICE_ERROR`],
    }
}

export function loadDeviceStrategy(host) {
    return {
        url: `http://192.168.3.106:8000/strategy/device/${host}`,

    };
}

export function showModal(host) {
    return {
        url: `http://192.168.3.106:8000/strategy/device/${host}`,
        types: [`LOAD_DEVICE`, `LOAD_DEVICE_SUCCESS`, `LOAD_DEVICE_ERROR`],
        payload: {
            host: host
        }
    };
}

export function hideModal() {
    return {
        type: 'HIDE_MODAL'
    };
}

export default function modal(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_MODAL': {
            return {
                ...state,
                visible: true,
                saved: false,
                host: action.payload.host,
            };
        }

        case 'HIDE_MODAL': {
            return {
                ...state,
                saved: false,
                visible: false,
            };
        }

        case 'LOAD_DEVICE': {
            return {
                ...state,
                saved: false,
                host: action.payload.host,
                loading: true,
                error: false
            };
        }

        case 'LOAD_DEVICE_SUCCESS': {
            return {
                ...state,
                saved: false,
                deviceStrategy: action.payload,
                visible: true,
                loading: false,
                error: false
            };
        }

        case 'LOAD_DEVICE_ERROR': {
            return {
                ...state,
                saved: false,
                visible: true,
                loading: false,
                error: true
            };
        }

        case 'CHANGE_DEVICE': {
            return {
                ...state,
                saved: false,
                loading: true,
                error: false
            };
        }

        case 'CHANGE_DEVICE_SUCCESS': {
            return {
                ...state,
                saved: true,
                result: true,
                loading: false,
                error: false
            };
        }

        case 'CHANGE_DEVICE_ERROR': {
            return {
                ...state,
                saved: true,
                result: false,
                loading: false,
                error: true
            };
        }


        default:
            return formReducer(state, action);
    }
}
