import { combineReducers } from "redux"
import createList from "../common/reducers/createList"
import createResource from "../common/reducers/createResource"
import * as types from "./types"

// Retailers reducer
//
const list = createList({
  RESET: types.APP_RETAILERS_LIST_RESET,
  REQUEST: types.APP_RETAILERS_LIST_REQUEST,
  SUCCESS: types.APP_RETAILERS_LIST_SUCCESS,
  FAILURE: types.APP_RETAILERS_LIST_FAILURE,
  INVALIDATE: types.APP_RETAILERS_LIST_INVALIDATE
})

// Edited retailer
//
const retailer = createResource({
  RESET: types.APP_RETAILERS_EDIT_RESET,
  REQUEST: types.APP_RETAILERS_EDIT_REQUEST,
  SUCCESS: types.APP_RETAILERS_EDIT_SUCCESS,
  FAILURE: types.APP_RETAILERS_EDIT_FAILURE,
  INVALIDATE: types.APP_RETAILERS_EDIT_INVALIDATE
})

// Manufacturers list
//
const manufacturersList = createList({
  RESET: types.APP_RETAILERS_MANUFACTURERS_LIST_RESET,
  REQUEST: types.APP_RETAILERS_MANUFACTURERS_LIST_REQUEST,
  SUCCESS: types.APP_RETAILERS_MANUFACTURERS_LIST_SUCCESS,
  FAILURE: types.APP_RETAILERS_MANUFACTURERS_LIST_FAILURE,
  INVALIDATE: types.APP_RETAILERS_MANUFACTURERS_LIST_INVALIDATE
})

// Groups list
//
const groupsList = createList({
  RESET: types.APP_RETAILERS_GROUPS_LIST_RESET,
  REQUEST: types.APP_RETAILERS_GROUPS_LIST_REQUEST,
  SUCCESS: types.APP_RETAILERS_GROUPS_LIST_SUCCESS,
  FAILURE: types.APP_RETAILERS_GROUPS_LIST_FAILURE,
  INVALIDATE: types.APP_RETAILERS_GROUPS_LIST_INVALIDATE
})

const group = createResource({
  RESET: types.APP_RETAILERS_GROUP_EDIT_RESET,
  REQUEST: types.APP_RETAILERS_GROUP_EDIT_REQUEST,
  SUCCESS: types.APP_RETAILERS_GROUP_EDIT_SUCCESS,
  FAILURE: types.APP_RETAILERS_GROUP_EDIT_FAILURE,
  INVALIDATE: types.APP_RETAILERS_GROUP_EDIT_INVALIDATE
})

const exportActions = createList({
  RESET: types.APP_RETAILERS_EDIT_ACTIONS_RESET,
  REQUEST: types.APP_RETAILERS_EDIT_ACTIONS_REQUEST,
  SUCCESS: types.APP_RETAILERS_EDIT_ACTIONS_SUCCESS,
  FAILURE: types.APP_RETAILERS_EDIT_ACTIONS_FAILURE,
  INVALIDATE: types.APP_RETAILERS_EDIT_ACTIONS_INVALIDATE,
})

export default combineReducers({
  list,
  retailer,
  group,
  manufacturersList,
  groupsList,
  exportActions,
})
