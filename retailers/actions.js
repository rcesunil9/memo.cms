import * as manufacturerApi from "../common/services/manufacturer"
import * as triggersApi from "../common/services/triggers"
import * as api from "../common/services/retailer"
import * as selectors from "./selectors"
import * as types from "./types"
import update from "immutability-helper"
import call from "../common/actions/call"

// Get retailers
//
export const getRetailers = ({ Skip, Take }) => async dispatch => {
  const responseData = await call(dispatch, () => api.getRetailers({ Skip, Take }), {
    REQUEST: types.APP_RETAILERS_LIST_REQUEST,
    FAILURE: types.APP_RETAILERS_LIST_FAILURE
  })
  return dispatch({
    type: types.APP_RETAILERS_LIST_SUCCESS,
    results: { ...responseData, totalPages: Math.ceil(responseData.total / Take) }
  })
}

// Get manufacturers
//
export const getManufacturers = () => async dispatch => {
  const responseData = await call(dispatch, () => manufacturerApi.getManufacturers(), {
    REQUEST: types.APP_RETAILERS_MANUFACTURERS_LIST_REQUEST,
    FAILURE: types.APP_RETAILERS_MANUFACTURERS_LIST_FAILURE
  })
  return dispatch({
    type: types.APP_RETAILERS_MANUFACTURERS_LIST_SUCCESS,
    results: responseData
  })
}

// Get groups
//
export const getGroups = () => async dispatch => {
  const responseData = await call(dispatch, () => api.getGroups(), {
    REQUEST: types.APP_RETAILERS_GROUPS_LIST_REQUEST,
    FAILURE: types.APP_RETAILERS_GROUPS_LIST_FAILURE
  })
  return dispatch({
    type: types.APP_RETAILERS_GROUPS_LIST_SUCCESS,
    results: responseData.results
  })
}

// Get retailer
//
export const getRetailer = id => async dispatch => {
  const responseData = await call(dispatch, () => api.getRetailerById(id), {
    REQUEST: types.APP_RETAILERS_EDIT_REQUEST,
    FAILURE: types.APP_RETAILERS_EDIT_FAILURE
  })
  return dispatch({
    type: types.APP_RETAILERS_EDIT_SUCCESS,
    resource: responseData
  })
}

// Edit retailer
//
export const editRetailer = newObject => ({
  type: types.APP_RETAILERS_EDIT_SUCCESS,
  resource: newObject
})

// Reset retailer
//
export const resetRetailer = () => ({ type: types.APP_RETAILERS_EDIT_RESET })

// Create retailer
//
export const createRetailer = retailer => async dispatch => {
  const r = await api.createRetailer(retailer)
  const id = r.data
  const newObj = update(retailer, { id: { $set: id } })
  dispatch(editRetailer(newObj))
}

// Update retailer
//
export const updateRetailer = retailer => () => api.updateRetailer(retailer)

// Delete retailer
//
export const deleteRetailer = id => () => api.deleteRetailerById(id)

// Edit group
//
export const editGroup = newObject => ({
  type: types.APP_RETAILERS_GROUP_EDIT_SUCCESS,
  resource: newObject
})

// Reset group
//
export const resetGroup = () => ({ type: types.APP_RETAILERS_GROUP_EDIT_RESET })

// Save group
//
export const saveGroup = () => async (dispatch, getState) => {
  const editedGroup = selectors.getGroupToEdit(getState())
  if (editedGroup.id) {
    return api.updateGroup(editedGroup)
  } else {
    return api.createGroup(editedGroup)
  }
}

// Get all export actions
//
export const getExportActions = () => dispatch => call(dispatch, triggersApi.getExportActions, {
  REQUEST: types.APP_RETAILERS_EDIT_ACTIONS_REQUEST,
  FAILURE: types.APP_RETAILERS_EDIT_ACTIONS_FAILURE,
}).then(results => dispatch({type: types.APP_RETAILERS_EDIT_ACTIONS_SUCCESS, results}))
export const resetExportActions = () => dispatch => dispatch({type: types.APP_RETAILERS_EDIT_ACTIONS_RESET})