import { combineReducers } from 'redux'
import createList from "../common/reducers/createList"
import createReducer from "../common/reducers/createReducer"
import * as types from './types'

// Trade items found reducer
//
const tradeItemsActions = {
  RESET: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_RESET,
  REQUEST: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_REQUEST,
  SUCCESS: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_SUCCESS,
  FAILURE: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_FAILURE,
  INVALIDATE: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_INVALIDATE,
}

// Search values
//
const filters = combineReducers({
  value: createReducer(null, {[types.APP_QUICK_SEARCH_VALUE_RECEIVE]: (state, action) => action.value || null})
})

// Combine reducer to get default reducer
//
export default combineReducers({
  tradeItems: createList(tradeItemsActions),
  filters,
  isDisplayed: createReducer(false, {[types.APP_QUICK_SEARCH_TOGGLE_DISPLAY]: (state, action) => !state})
})
