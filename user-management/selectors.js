import { createSelector } from "reselect"
import get from "lodash/get"
import { getResults } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"

// Direct accessors to state
//
const getUsers = state => state.userManagement.users
const getGroups = state => state.userManagement.groups
const getRights = state => state.userManagement.rights
const getUser = state => state.userManagement.editedUser
const getGroup = state => state.userManagement.editedGroup
const getRight = state => state.userManagement.editedRight
const _getRetailers = createSelector(state => state.userManagement.retailers, getResults)
export const getPassword = state => state.userManagement.password

// Computed selectors
//
export const getUsersList = createSelector(getUsers, getResults)
export const getRightsList = createSelector(getRights, getResults)
export const getGroupsList = createSelector(getGroups, getResults)
export const getManufacturers = createSelector(state => state.userManagement.manufacturers, getResults)
export const getRetailers = createSelector(_getRetailers, retailers => get(retailers, "results", []))

export const getUserObject = createSelector(getUser, getResource)
export const getGroupObject = createSelector(getGroup, getResource)
export const getRightObject = createSelector(getRight, getResource)
