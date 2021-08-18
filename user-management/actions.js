import update from "immutability-helper"
import call from "../common/actions/call"
import * as api from "../common/services/userManagement"
import * as manufacturerApi from "../common/services/manufacturer"
import * as retailerApi from "../common/services/retailer"
import * as types from "./types"
import get from "lodash/get"

// Load users
//
export const loadUsers = () => dispatch => {
  call(dispatch, api.getAllUsers, {
    REQUEST: types.USER_MANAGEMENT_USERS_LIST_REQUEST,
    FAILURE: types.USER_MANAGEMENT_USERS_LIST_FAILURE
  }).then(data => dispatch({ type: types.USER_MANAGEMENT_USERS_LIST_SUCCESS, results: data }))
}

// Load groups
//
export const loadGroups = () => dispatch => {
  call(dispatch, api.getAllGroups, {
    REQUEST: types.USER_MANAGEMENT_GROUPS_LIST_REQUEST,
    FAILURE: types.USER_MANAGEMENT_GROUPS_LIST_FAILURE
  }).then(data => dispatch({ type: types.USER_MANAGEMENT_GROUPS_LIST_SUCCESS, results: data }))
}

// Load rights
//
export const loadRights = () => dispatch => {
  call(dispatch, api.getAllRights, {
    REQUEST: types.USER_MANAGEMENT_RIGHTS_LIST_REQUEST,
    FAILURE: types.USER_MANAGEMENT_RIGHTS_LIST_FAILURE
  }).then(data => dispatch({ type: types.USER_MANAGEMENT_RIGHTS_LIST_SUCCESS, results: data }))
}

// Load user
//
export const loadUser = id => dispatch =>
  call(dispatch, () => api.getUser(id), {
    REQUEST: types.USER_MANAGEMENT_USER_REQUEST,
    FAILURE: types.USER_MANAGEMENT_USER_FAILURE
  }).then(resource => dispatch({ type: types.USER_MANAGEMENT_USER_SUCCESS, resource: {id, ...resource} }))

// Edit user
//
export const editUser = newObject => ({
  type: types.USER_MANAGEMENT_USER_SUCCESS,
  resource: newObject
})

// Reset user
//
export const resetUser = () => dispatch => dispatch({ type: types.USER_MANAGEMENT_USER_RESET })

// Create user
//
export const createUser = user => async dispatch => {
  const userInfo = (await api.createUser(user)).data // clearPassword, userId
  dispatch(editUser(update(user, { id: { $set: get(userInfo, "userId", null) } })))
  return dispatch(showUserPassword(get(userInfo, "clearPassword", null)))
}

// Change password
//
export const changePassword = id => async dispatch => {
  const password = (await api.changePassword(id)).data
  return dispatch(showUserPassword(password))
}

export const showUserPassword = password => ({type: types.USER_MANAGEMENT_SHOW_USER_PASSWORD, password})

// Update user
//
export const updateUser = user => () => api.updateUser(user)

// Delete user
//
export const deleteUser = id => () => api.deleteUser(id)

// Load group
//
export const loadGroup = id => dispatch =>
  call(dispatch, () => api.getGroup(id), {
    REQUEST: types.USER_MANAGEMENT_GROUP_REQUEST,
    FAILURE: types.USER_MANAGEMENT_GROUP_FAILURE
  }).then(resource => dispatch({ type: types.USER_MANAGEMENT_GROUP_SUCCESS, resource }))

// Edit group
//
export const editGroup = newObject => ({
  type: types.USER_MANAGEMENT_GROUP_SUCCESS,
  resource: newObject
})

// Reset group
//
export const resetGroup = () => dispatch => dispatch({ type: types.USER_MANAGEMENT_GROUP_RESET })

// Create group
//
export const createGroup = group => async dispatch => {
  const id = (await api.createGroup(group)).data
  return dispatch(editGroup(update(group, { id: { $set: id } })))
}

// Update group
//
export const updateGroup = group => () => api.updateGroup(group)

// Delete group
//
export const deleteGroup = id => () => api.deleteGroup(id)

// Load right
//
export const loadRight = id => dispatch =>
  call(dispatch, () => api.getRight(id), {
    REQUEST: types.USER_MANAGEMENT_RIGHT_REQUEST,
    FAILURE: types.USER_MANAGEMENT_RIGHT_FAILURE
  }).then(resource => dispatch({ type: types.USER_MANAGEMENT_RIGHT_SUCCESS, resource }))

// Edit right
//
export const editRight = newObject => ({
  type: types.USER_MANAGEMENT_RIGHT_SUCCESS,
  resource: newObject
})

// Reset right
//
export const resetRight = () => dispatch => dispatch({ type: types.USER_MANAGEMENT_RIGHT_RESET })

// Create right
//
export const createRight = right => async dispatch => {
  const id = (await api.createRight(right)).data
  return dispatch(editRight(update(right, { id: { $set: id } })))
}

// Update right
//
export const updateRight = right => () => api.updateRight(right)

// Delete right
//
export const deleteRight = id => () => api.deleteRight(id)

// load manufacturers
//
export const loadManufacturers = () => dispatch => call(dispatch, manufacturerApi.getManufacturers, {
    REQUEST: types.USER_MANAGEMENT_MANUFACTURERS_LIST_REQUEST,
    FAILURE: types.USER_MANAGEMENT_MANUFACTURERS_LIST_FAILURE
  }).then(data => dispatch({ type: types.USER_MANAGEMENT_MANUFACTURERS_LIST_SUCCESS, results: data }))

export const resetManufacturers = () => dispatch => dispatch({type: types.USER_MANAGEMENT_MANUFACTURERS_LIST_RESET})

// load retailers
//
export const loadRetailers = () => dispatch => call(dispatch, () => retailerApi.getRetailers({Skip: 0, Take: 999}), {
  REQUEST: types.USER_MANAGEMENT_RETAILERS_LIST_REQUEST,
  FAILURE: types.USER_MANAGEMENT_RETAILERS_LIST_FAILURE
}).then(data => dispatch({ type: types.USER_MANAGEMENT_RETAILERS_LIST_SUCCESS, results: data }))
  
export const resetRetailers = () => dispatch => dispatch({type: types.USER_MANAGEMENT_RETAILERS_LIST_RESET})