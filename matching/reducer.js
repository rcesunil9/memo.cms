import { combineReducers } from 'redux'
// import update from 'immutability-helper'
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
// import createResource from "../common/reducers/createResource"
import * as types from './types'
import { getDefaultMatchingRowsFilters } from "./utils"

// Actions
//
const matchingRowsActions = {
  RESET: types.APP_MATCHING_ROWS_RESET,
  REQUEST: types.APP_MATCHING_ROWS_REQUEST,
  SUCCESS: types.APP_MATCHING_ROWS_SUCCESS,
  FAILURE: types.APP_MATCHING_ROWS_FAILURE,
  INVALIDATE: types.APP_MATCHING_ROWS_INVALIDATE,
  REMOVE: types.APP_MATCHING_ROWS_REMOVE,
}

const manufacturersListActions = {
  RESET: types.APP_MATCHING_LIST_MANUFACTURERS_RESET,
  REQUEST: types.APP_MATCHING_LIST_MANUFACTURERS_REQUEST,
  SUCCESS: types.APP_MATCHING_LIST_MANUFACTURERS_SUCCESS,
  FAILURE: types.APP_MATCHING_LIST_MANUFACTURERS_FAILURE,
  INVALIDATE: types.APP_MATCHING_LIST_MANUFACTURERS_INVALIDATE,
  REMOVE: types.APP_MATCHING_LIST_MANUFACTURERS_REMOVE,
}

const retailersListActions = {
  RESET: types.APP_MATCHING_LIST_RETAILERS_RESET,
  REQUEST: types.APP_MATCHING_LIST_RETAILERS_REQUEST,
  SUCCESS: types.APP_MATCHING_LIST_RETAILERS_SUCCESS,
  FAILURE: types.APP_MATCHING_LIST_RETAILERS_FAILURE,
  INVALIDATE: types.APP_MATCHING_LIST_RETAILERS_INVALIDATE,
  REMOVE: types.APP_MATCHING_LIST_RETAILERS_REMOVE,
}

const tradeItemsListActions = {
  RESET: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_RESET,
  REQUEST: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_REQUEST,
  SUCCESS: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_SUCCESS,
  FAILURE: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_FAILURE,
  INVALIDATE: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_INVALIDATE,
  REMOVE: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_REMOVE,
}

// Reducers
//
const matchingRows = combineReducers({
  data: createList(matchingRowsActions),
  total: createReducer(0, {[types.APP_MATCHING_ROWS_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  filters: createReducer(getDefaultMatchingRowsFilters(), {[types.APP_MATCHING_ROWS_FILTERS_RECEIVE]: (state, action) => action.filters || getDefaultMatchingRowsFilters()}),
})

const matching = combineReducers({
  requestedTradeItem: createReducer(null, {[types.APP_MATCHING_MATCH_RECEIVE]: (state, action) => action.requestedTradeItem || null}),
  filters: createReducer("", {[types.APP_MATCHING_MATCH_FILTERS_RECEIVE]: (state, action) => action.filters || ""}),
  tradeItems: createList(tradeItemsListActions),
  tradeItemSelected: createReducer(null, {[types.APP_MATCHING_MATCH_TRADE_ITEM_RECEIVE]: (state, action) => action.tradeItem || null}),
  isCreating: createReducer(false, {[types.APP_MATCHING_MATCH_IS_CREATING_NEW_RECEIVE]: (state, action) => action.isCreating || null}),
})

const manufacturers = combineReducers({
  list: createList(manufacturersListActions),
})

const retailers = combineReducers({
  list: createList(retailersListActions),
})

// Combine reducer to get default reducer
//
export default combineReducers({
  matchingRows,
  manufacturers,
  retailers,
  matching,
})
