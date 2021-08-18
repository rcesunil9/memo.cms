import { combineReducers } from 'redux'
import createResource from "../common/reducers/createResource"
import createReducer from "../common/reducers/createReducer"
import * as types from './types'

// Trade items found reducer
//
const userActions = {
  RESET: types.APP_AUTH_USER_RESET,
  REQUEST: types.APP_AUTH_USER_REQUEST,
  SUCCESS: types.APP_AUTH_USER_SUCCESS,
  FAILURE: types.APP_AUTH_USER_FAILURE,
  INVALIDATE: types.APP_AUTH_USER_INVALIDATE,
}

// Combine reducer to get default reducer
//
export default combineReducers({
	user: createResource(userActions),
	token: createReducer(null, {[types.APP_AUTH_TOKEN_RECEIVE]: (state, action) => action.token || null})
})