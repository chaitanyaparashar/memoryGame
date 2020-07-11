import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import homeReducer from './Reducer/HomeReducer';

const AppReducers = combineReducers({
  homeReducer: homeReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
