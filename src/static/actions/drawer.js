/**
 * Created by lan on 17-3-15.
 */
import {
    SHOW_DRAWER,
    HIDE_DRAWER,

    INIT_MONITOR_DATA,
} from '../constants';


export function showDrawer(host) {
    return (dispatch) => {
        dispatch({
            type: SHOW_DRAWER,
            payload: {
                host
            }});
    };
}

export function hideDrawer() {
    return (dispatch) => {
        dispatch({type: HIDE_DRAWER});
        dispatch({type: INIT_MONITOR_DATA});
    };
}
