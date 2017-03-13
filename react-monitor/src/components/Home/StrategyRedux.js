import config from './Modal.config';
import {bindRedux} from 'redux-form-utils';


const initialState = {
    strategy: [],
    loading: true,
    error: false,
};

export function addStrategy(name, host, strategy) {
    return {
        url: `http://192.168.3.106:8000/strategy/${name}/${host}`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            strategy
        ),
        types: [`ADD_${name}`, `ADD_${name}_SUCCESS`, `ADD_${name}_ERROR`],
    }
}

export function removeStrategy(name, host, strategy_ids) {
    return {
        url: `http://192.168.3.106:8000/strategy/${name}/${host}`,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            strategy_ids
        ),
        types: [`DELETE__${name}`, `DELETE_${name}_SUCCESS`, `DELETE_${name}_ERROR`],
    }
}

export default function createReducerWithNamedType(name = '') {
    return (state = initialState, action) => {
        switch (action.type) {
            case `ADD_${name}`: {
                return {
                    ...state,
                    strategy: [],
                    loading: false,
                    error: false
                }
            }

            case `ADD_${name}_ERROR`: {
                return {
                    ...state,
                    strategy: [],
                    loading: false,
                    error: false
                }
            }

            case `ADD_${name}_SUCCESS`: {
                return {
                    ...state,
                    strategy: action.payload,
                    loading: false,
                    error: false
                }
            }

            case `DELETE_${name}`: {
                return {
                    ...state,
                    strategy: [],
                    loading: false,
                    error: false
                }
            }

            case `DELETE_${name}_ERROR`: {
                return {
                    ...state,
                    strategy: [],
                    loading: false,
                    error: false
                }
            }

            case `DELETE_${name}_SUCCESS`: {
                return {
                    ...state,
                    strategy: action.payload,
                    loading: false,
                    error: false
                }
            }

            default:
                return state;
        }
    }
}
