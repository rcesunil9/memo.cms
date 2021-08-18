import { combineReducers } from 'redux'
import createReducer from "../common/reducers/createReducer"
import * as types from './types'


const loading = createReducer(0, {
  [types.APP_RUNNERS_LOADING_AWAITING_RESET]: (state, action) => 0,
  [types.APP_RUNNERS_LOADING_AWAITING_ADD]: (state, action) => state+1,
  [types.APP_RUNNERS_LOADING_AWAITING_REMOVE]: (state, action) => state-1,
})

export default combineReducers({
  loading
})