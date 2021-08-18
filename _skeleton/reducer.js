import { combineReducers } from 'redux'
import dotProp from "dot-prop-immutable"
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import createResource from "../common/reducers/createResource"
import * as types from './types'

// Actions
//
const listActions = {
  RESET: types.ACTION_LIST_RESET,
  REQUEST: types.ACTION_LIST_REQUEST,
  SUCCESS: types.ACTION_LIST_SUCCESS,
  FAILURE: types.ACTION_LIST_FAILURE,
  INVALIDATE: types.ACTION_LIST_INVALIDATE,
  REMOVE: types.ACTION_LIST_REMOVE,
}

const resourceAction = {
  RESET: types.ACTION_RESOURCE_RESET,
  SUCCESS: types.ACTION_RESOURCE_SUCCESS,
}

// Reducers
//
const listing = combineReducers({
  myList: createList(listActions),
  selectedIndex: createReducer(0, {[types.ACTION_LIST_ITEM_SELECTED_RECEIVE]: (state, action) => action.selected ||0}),
})

const dependencies = combineReducers({
  dependency1: createResource(resourceAction)
})

// Combine reducer to get default reducer
//
export default combineReducers({
  listing,
  dependencies,
})
