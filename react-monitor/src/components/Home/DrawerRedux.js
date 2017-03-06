/**
 * Created by lan on 3/5/17.
 */
import config from './Modal.config';
import { bindRedux } from 'redux-form-utils';

const { state: formState, reducer: formReducer } = bindRedux(config);

const initialState = {
    open: false,
    ...formState,
    title: '',
    time: 'hour',
};

export function addArticle() {
    return (dispatch, getState) => {
        const { title, desc, date } = getState().article.dialog.form;
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

export function showDrawer(title) {
    return {
        type: 'SHOW_DRAWER',
        payload: {
            title: title
        }
    };
}

export function hideDrawer() {
    return {
        type: 'HIDE_DRAWER'
    };
}

export function buttonClick(time) {
    return {
        type: 'BUTTON_CLICK',
        payload: {
            time: time
        }
    };
}

export default function drawer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_DRAWER': {
            return {
                ...state,
                open: true,
                title: action.payload.title,
            };
        }

        case 'HIDE_DRAWER': {
            return {
                ...state,
                open: false,
            };
        }

        case 'BUTTON_CLICK': {
            return {
                ...state,
                time: action.payload.time,
            };
        }

        default:
            return formReducer(state, action);
    }
}
