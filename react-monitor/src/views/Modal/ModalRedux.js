/**
 * Created by lan on 17-3-8.
 */
import {combineReducers} from 'redux';
import createReducer from '../../components/Home/StrategyRedux'

export default combineReducers({
    ipPacket: createReducer('ip_packet'),
    file: createReducer('file'),
    // fileInfo: createReducer('fileinfo'),
})

export * as strategyActions from '../../components/Home/StrategyRedux';