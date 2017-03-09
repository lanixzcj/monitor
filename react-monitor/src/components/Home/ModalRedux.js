import config from './Modal.config';
import {bindRedux} from 'redux-form-utils';

const {state: formState, reducer: formReducer} = bindRedux(config);

const initialState = {
    visible: false,
    host: '',
    deviceStrategy: {},
    loading: true,
    error: false,
    ...formState,
};

export function addArticle() {
    return (dispatch, getState) => {
        const {title, desc, date} = getState().article.dialog.form;
        return dispatch({
            url: '/api/article.json',
            method: 'POST',
            params: {
                title: title.value,
                desc: desc.value,
                date: date.value
            }
        });
    };
}

export function loadDeviceStrategy(host) {
    return {
        url: `http://192.168.3.106:8000/strategy/device/${host}`,
        types: [`LOAD_DEVICE`, `LOAD_DEVICE_SUCCESS`, `LOAD_DEVICE_ERROR`],
    };
}

export function showModal(host) {
    return {
        type: 'SHOW_MODAL',
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
                host: action.payload.host,
            };
        }

        case 'HIDE_MODAL': {
            return {
                ...state,
                visible: false,
            };
        }

        case 'LOAD_DEVICE': {
            return {
                ...state,
                loading: true,
                error: false
            };
        }

        case 'LOAD_DEVICE_SUCCESS': {
            return {
                ...state,
                deviceStrategy: action.payload,
                loading: false,
                error: false
            };
        }

        case 'LOAD_DEVICE_ERROR': {
            return {
                ...state,
                loading: false,
                error: true
            };
        }

        default:
            return formReducer(state, action);
    }
}
