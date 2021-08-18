import axios from "axios"
import * as env from "../../environment/index.js"

const base = `${env.CDM_USER_MANAGEMENT_URI}/api`
const CDM_USER_MANAGEMENT_INTERNAL = `${base}/Internal`
const CDM_USER_MANAGEMENT_USER = `${base}/User`
const CDM_USER_MANAGEMENT_GROUP = `${base}/UserGroup`
const CDM_USER_MANAGEMENT_RIGHT = `${base}/Right`

// Get all users
//
export const getAllUsers = () => axios.get(`${CDM_USER_MANAGEMENT_USER}/all`)

// Get users
//
export const getUsers = ({ PageNumber, PageSize }) =>
  axios.get(CDM_USER_MANAGEMENT_USER, { params: { PageNumber, PageSize } })

// Get user
//
export const getUser = id => axios.get(`${CDM_USER_MANAGEMENT_USER}/${id}`)

// Create user
//
export const createUser = user => axios.post(CDM_USER_MANAGEMENT_USER, user)

// Update user
//
export const updateUser = user => axios.put(`${CDM_USER_MANAGEMENT_USER}/${user.id}`, user)

// Delete user
//
export const deleteUser = id => axios.delete(`${CDM_USER_MANAGEMENT_USER}/${id}`)

// Change password
//
export const changePassword = userId =>
  axios.put(`${CDM_USER_MANAGEMENT_USER}/changePassword/${userId}`, JSON.stringify(userId), {
    headers: { "Content-Type": "application/json" }
  })

// Get all groups
//
export const getAllGroups = () => axios.get(`${CDM_USER_MANAGEMENT_GROUP}/all`)

// Get groups
//
export const getGroups = ({ PageNumber, PageSize }) =>
  axios.get(CDM_USER_MANAGEMENT_GROUP, { params: { PageNumber, PageSize } })

// Get groups
//
export const getGroup = id => axios.get(`${CDM_USER_MANAGEMENT_GROUP}/${id}`)

// Update group
//
export const updateGroup = group => axios.put(`${CDM_USER_MANAGEMENT_GROUP}/${group.id}`, group)

// Delete group
//
export const deleteGroup = id => axios.delete(`${CDM_USER_MANAGEMENT_GROUP}/${id}`)

// Create group
//
export const createGroup = group => axios.post(CDM_USER_MANAGEMENT_GROUP, group)

// Get all rights
//
export const getAllRights = () => axios.get(`${CDM_USER_MANAGEMENT_RIGHT}/all`)

// Get right
//
export const getRight = id => axios.get(`${CDM_USER_MANAGEMENT_RIGHT}/${id}`)

// Update right
//
export const updateRight = right => axios.put(`${CDM_USER_MANAGEMENT_RIGHT}/${right.id}`, right)

// Delete right
//
export const deleteRight = id => axios.delete(`${CDM_USER_MANAGEMENT_RIGHT}/${id}`)

// Get rights
//
export const getRights = ({ PageNumber, PageSize }) =>
  axios.get(CDM_USER_MANAGEMENT_RIGHT, { params: { PageNumber, PageSize } })

// Create right
//
export const createRight = right => axios.post(CDM_USER_MANAGEMENT_RIGHT, right)

// Get all users
//
export const getAllUsersByManufacturerId = manufacturerId => axios.get(`${CDM_USER_MANAGEMENT_INTERNAL}/GetByManufacturerId/${manufacturerId}`)