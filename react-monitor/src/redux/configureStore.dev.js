import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';

import createFetchMiddleware from 'redux-composable-fetch';
import ThunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import DevTools from './DevTools';


//type[0]:load type[1]:success type[2]:fail
const FetchMiddleware = createFetchMiddleware({
    afterFetch({action, result}) {
        return result.json().then(data => {
            return Promise.resolve({
                action,
                result: data,
            });
        });
    },
});

const finalCreateStore = compose(
    applyMiddleware(ThunkMiddleware, FetchMiddleware, routerMiddleware(browserHistory)),
    DevTools.instrument()
)(createStore);

const reducer = combineReducers(Object.assign({}, rootReducer, {
    routing: routerReducer,
}));

export default function configureStore(initialState) {
    const store = finalCreateStore(reducer, initialState);

    return store;
}
