import { combineReducers } from 'redux';

// 引入 reducer 及 actionCreator
import table from '../components/Home/TableRedux';
import drawer from '../components/Home/DrawerRedux';
import modal from '../components/Home/ModalRedux';
import montable from '../components/Home/MonitorTableRedux'

export default combineReducers({
  table,
  modal,
    drawer,
    montable,
});

export * as tableActions from '../components/Home/TableRedux';
export * as modalActions from '../components/Home/ModalRedux';
export * as drawerActions from '../components/Home/DrawerRedux';
export * as monActions from '../components/Home/MonitorTableRedux';

