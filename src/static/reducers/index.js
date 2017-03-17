import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import hostsReducer from './hosts';
import drawerReducer from './drawer';
import monitorReducer from './monitorData'
import modalReducer from './modal'
import strategyReducer from './strategy'

export default combineReducers({
    hosts: hostsReducer,
    monitor: monitorReducer,
    strategy: strategyReducer,
    drawer: drawerReducer,
    modal: modalReducer,
    routing: routerReducer
});
