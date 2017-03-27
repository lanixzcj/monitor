/**
 * Created by lan on 17-3-15.
 */
import {
    SHOW_DRAWER,
    HIDE_DRAWER,

    INIT_MONITOR_DATA,
} from '../constants';

import {loadAllMonitors} from './monitorData';

export function showDrawer(host) {
    return (dispatch) => {
        dispatch({
            type: SHOW_DRAWER,
            payload: {
                host
            }});
        // dispatch(loadAllMonitors(host));
    };
}

export function hideDrawer() {
    return (dispatch) => {
        dispatch({type: HIDE_DRAWER});
        dispatch({type: INIT_MONITOR_DATA});
    };
}
