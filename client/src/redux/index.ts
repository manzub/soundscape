import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import { appReducer, userReducer } from "./reducers";
import thunk from "redux-thunk";

const rootReducers = combineReducers({ user: userReducer, app: appReducer });

function persistLocal(state: any) {
  try{
    const serialisedState = JSON.stringify(state);
    localStorage.setItem('_uniqPersistantStateId', serialisedState);
  } catch(e) {
    console.warn(e)
  }
}


function extractLocal() {
  try{
    const serialisedState = localStorage.getItem('_uniqPersistantStateId');
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

// const store = createStore(rootReducers, extractLocal(), applyMiddleware(thunk));
const store =  configureStore({ reducer: rootReducers, enhancers: [applyMiddleware(thunk)], preloadedState: extractLocal() });

store.subscribe(() => persistLocal(store.getState()));

export default store;