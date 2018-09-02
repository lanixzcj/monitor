/**
 * Created by lan on 17-3-15.
 */
import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    SHOW_MODAL,
    HIDE_MODAL,

    INIT_STRATEGY_DATA,
} from '../constants';

export function showModal(host) {
    return {
        type: SHOW_MODAL,
        payload: {
            host
        }
    };
}

export function hideModal() {
    return (dispatch) => {
        dispatch({type: HIDE_MODAL});
        dispatch({type: INIT_STRATEGY_DATA});
    };
}