/**
 * Created by lan on 17-3-15.
 */
import {
    SHOW_DRAWER,
    HIDE_DRAWER,
} from '../constants';

export function showDrawer(host) {
    return {
        type: SHOW_DRAWER,
        payload: {
            host
        }
    };
}

export function hideDrawer() {
    return {
        type: HIDE_DRAWER,
    };
}
