import get from "lodash/get"
import * as api from '../common/services/transportManagement'
import * as types from './types'
import * as selectors from "./selectors"
import call from "../common/actions/call"

// an action
export const getTransportManagementList = () => (dispatch, getState) => call(dispatch, () => api.getTransportConfigurations(selectors.getTransportConfigurationListFilters(getState())), {
  REQUEST: types.APP_TRANSPORT_MANAGEMENT_LIST_REQUEST,
  FAILURE: types.APP_TRANSPORT_MANAGEMENT_LIST_FAILURE,
}).then(results => {
  dispatch({type: types.APP_TRANSPORT_MANAGEMENT_LIST_SUCCESS, results: get(results, "results", [])})
  dispatch({type: types.APP_TRANSPORT_MANAGEMENT_LIST_TOTAL_RECEIVE, total: get(results, "total", null)})
})

export const deleteTransportConfiguration = (id) => dispatch => api.deleteTransportConfiguration(id)
  .then(
    res => dispatch({type: types.APP_TRANSPORT_MANAGEMENT_LIST_REMOVE, key: 'id', value: id}))

export const getTransportConfiguration = id => dispatch => api.getTransportConfiguration(id).then(
  res => dispatch({type: types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_RECEIVE, transportConfiguration: res.data})
)

export const resetTransportConfiguration = () => dispatch => dispatch({type: types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_RESET})

export const updateTransportManagementListFilterValue = (key, value) => (dispatch, getState) => {
  dispatch({type: types.APP_TRANSPORT_MANAGEMENT_LIST_FILTERS_VALUE_RECEIVE, key, value})
  getTransportManagementList()(dispatch, getState)
}

export const setTransportConfigurationEditValue = (key, value) => dispatch => dispatch({type: types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_VALUE_RECEIVE, key, value})

export const createTransportConfiguration = transportConfiguration => dispatch => api.createTransportConfiguration(transportConfiguration).then(res => res.data)

export const updateTransportConfiguration = (id, transportConfiguration) => dispatch => api.updateTransportConfiguration(id, transportConfiguration)