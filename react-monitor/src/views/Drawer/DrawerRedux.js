/**
 * Created by lan on 17-3-7.
 */
import {combineReducers} from 'redux';

// 引入 reducer 及 actionCreator
import drawer from '../../components/Home/DrawerRedux';
import createMonReducer from '../../components/Home/MonitorTableRedux'

export default combineReducers({
    drawer,
    all: createMonReducer('all'),
    // ipPacket: createMonReducer('ip_packet'),
    // fileInfo: createMonReducer('fileinfo'),
    // processInfo: createMonReducer('processinfo'),
    // mediaInfo: createMonReducer('mediainfo'),
    // warningInfo: createMonReducer('warninginfo'),
    // deviceInfo: createMonReducer('deviceinfo'),
});

export * as drawerActions from '../../components/Home/DrawerRedux';
export * as monActions from '../../components/Home/MonitorTableRedux';

