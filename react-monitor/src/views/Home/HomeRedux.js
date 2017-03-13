import {combineReducers} from 'redux';

// 引入 reducer 及 actionCreator
import table from '../../components/Home/TableRedux';
import drawer from '../../components/Home/DrawerRedux';
import user from '../../layouts/NavRedux';
import modal from '../../components/Home/ModalRedux';
import createMonReducer from '../../components/Home/MonitorTableRedux'

export default combineReducers({
    table,
    modal,
    drawer,
    user,
});

export * as tableActions from '../../components/Home/TableRedux';
export * as modalActions from '../../components/Home/ModalRedux';
export * as drawerActions from '../../components/Home/DrawerRedux';
export * as userActions from '../../layouts/NavRedux';

