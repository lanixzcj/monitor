import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import hostsReducer from './hosts';
import drawerReducer from './drawer';
import monitorReducer from './monitorData'
import modalReducer from './modal'
import strategyReducer from './strategy'
import {createReducerWithType} from './strategy'
import {reducer as toastrReducer} from 'react-redux-toastr'
import { loadingBarReducer } from 'react-redux-loading-bar'

export default combineReducers({
    hosts: hostsReducer,
    monitor: monitorReducer,
    strategy: strategyReducer,
    drawer: drawerReducer,
    modal: modalReducer,
    fileStrategy: createReducerWithType('file'),
    ipStrategy: createReducerWithType('ip_packet'),
    toastr: toastrReducer,
    loadingBar: loadingBarReducer,
    routing: routerReducer
});
