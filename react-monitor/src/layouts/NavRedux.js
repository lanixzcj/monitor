import config from '../components/Home/Modal.config';
import {bindRedux} from 'redux-form-utils';


const initialState = {
    user: {},
    loading: true,
    error: false,
};

export function getUser() {
    return {
        url: `http://192.168.3.106:8000/user/`,
        types: [`GET_USER`, `GET_USER_SUCCESS`, `GET_USER_ERROR`],
    }
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case `GET_USER`: {
            return {
                ...state,
                loading: false,
                error: false
            }
        }

        case `GET_USER_ERROR`: {
            return {
                ...state,
                user: {},
                loading: false,
                error: false
            }
        }

        case `GET_USER_SUCCESS`: {
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: false
            }
        }

        default:
            return state;
    }
}
