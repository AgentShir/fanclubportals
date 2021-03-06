import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {apiMiddleware, authReducer} from './lib/auth'

// import your reducers here
import appReducer from './reducers/app'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, apiMiddleware)(createStore)

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer // insert all your other reducers here
})

const store = createStoreWithMiddleware(rootReducer,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
