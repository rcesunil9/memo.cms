import update from "immutability-helper"
import call from "../common/actions/call"
import { getByTaxonomyIdAndTradeItemCategoryCode } from "../common/services/businessRules"
import { getRetailers } from "../common/services/retailer"
import { getLanguages, getTargetMarkets } from "../common/services/targetMarket"
import { getAllTransportConfigurations } from "../common/services/transportManagement"
import { getAllConnectors } from "../common/services/subscription"
import { getTaxonomies } from "../common/services/taxonomy"
import * as api from "../common/services/triggers"
import * as preComputingApi from '../common/services/preComputing'
import * as manufacturersApi from '../common/services/manufacturer'
import * as importResourceApi from '../common/services/importResource'
import { getAllUsers } from "../common/services/userManagement"
import { getFormatsByTradeItemCategory } from "../common/services/exportFormats"
import * as types from "./types"
import * as selectors from "./selectors"
import { getTradeItemCategories } from "../common/services/tradeItemCategories"

// Load triggers
//
export const loadTriggers = () => async dispatch => {
  const results = await call(dispatch, api.getTriggers, {
    REQUEST: types.TRIGGERS_TRIGGERS_LIST_REQUEST,
    FAILURE: types.TRIGGERS_TRIGGERS_LIST_FAILURE
  })
  dispatch({ type: types.TRIGGERS_TRIGGERS_LIST_SUCCESS, results })
}

// Reset triggers
//
export const resetTriggers = () => ({ type: types.TRIGGERS_TRIGGERS_LIST_RESET })

// Load trigger
//
export const loadTrigger = id => async dispatch => {
  const responseData = await call(dispatch, () => api.getTriggerById(id), {
    REQUEST: types.TRIGGERS_TRIGGER_REQUEST,
    FAILURE: types.TRIGGERS_TRIGGER_FAILURE
  })
  return dispatch({
    type: types.TRIGGERS_TRIGGER_SUCCESS,
    resource: responseData
  })
}

// Load new trigger
//
export const loadNewTrigger = () => ({
  type: types.TRIGGERS_TRIGGER_SUCCESS,
  resource: {
    id: null,
    discriminator: "NewFileOnFTPTriggerViewModel",
    name: "",
    actions: [],
    actionParameters: [],
    activationPeriods: [],
    url: "",
    username: "",
    password: "",
    path: "/",
    fileExtensions: []
  }
})

// Edit trigger
//
export const editTrigger = newObject => ({
  type: types.TRIGGERS_TRIGGER_SUCCESS,
  resource: newObject
})

// Reset trigger
//
export const resetTrigger = () => ({ type: types.TRIGGERS_TRIGGER_RESET })

// Create trigger
//
export const createTrigger = trigger => async dispatch => {
  const r = await api.createTrigger(trigger)
  const id = r.data
  const newObj = update(trigger, { id: { $set: id } })
  dispatch(editTrigger(newObj))
  return id
}

// Update trigger
//
export const updateTrigger = trigger => () => {
  return api.updateTrigger(trigger)
}

// Delete trigger
//
export const deleteTrigger = id => () => api.deleteTriggerById(id)

// Load actions
//
export const loadActions = () => async dispatch => {
  const results = await call(dispatch, api.getActions, {
    REQUEST: types.TRIGGERS_ACTIONS_LIST_REQUEST,
    FAILURE: types.TRIGGERS_ACTIONS_LIST_FAILURE
  })
  dispatch({ type: types.TRIGGERS_ACTIONS_LIST_SUCCESS, results })
}

// Reset actions
//
export const resetActions = () => ({ type: types.TRIGGERS_ACTIONS_LIST_RESET })

// Set action
//
export const setAction = action => ({type: types.TRIGGERS_ACTION_SUCCESS, resource: action})

// Load action
//
export const loadAction = id => async dispatch => {
  const responseData = await call(dispatch, () => api.getActionById(id), {
    REQUEST: types.TRIGGERS_ACTION_REQUEST,
    FAILURE: types.TRIGGERS_ACTION_FAILURE
  })
  return dispatch({
    type: types.TRIGGERS_ACTION_SUCCESS,
    resource: responseData
  })
}

// Load new action
//
export const loadNewAction = () => ({
  type: types.TRIGGERS_ACTION_SUCCESS,
  resource: {
    id: null,
    name: "",
    targetRetailerId: "",
    businessRulesetIds: [],
    tradeItemCategories: [],
    formatConfigurationId: "",
    transportConfigurationId: "",
    exportLanguageId: "",
    doEnrichment: false,
    doTradItemsFilter: false,
    doImportStatistics: false,
    extraExportLanguages: [],
    manufacturerIds: [],
    discriminator: "ExportPreComputedTradeItemActionViewModel",
    exportTradeItemImageActionIds: null,
  }
})

// Edit action
//
export const editAction = newObject => ({
  type: types.TRIGGERS_ACTION_SUCCESS,
  resource: newObject
})

// Reset action
//
export const resetAction = () => ({ type: types.TRIGGERS_ACTION_RESET })

// Create action
//
export const createAction = action => async dispatch => {
  return api.createAction(action).then(res => res.data)
}

// Update action
//
export const updateAction = action => () => {
  return api.updateAction(action)
}

// Launch action
//
export const launchAction = (actionId, params) => dispatch => {
  api.launchAction(actionId, params)
}

// Launch trigger
//
export const launchTrigger = (triggerId) => dispatch => api.launchTrigger(triggerId)


// SHow/Hide input parameters triggered by the launch action
//
export const showInputParameters = () => dispatch => dispatch({type: types.TRIGGERS_ACTION_SHOW_PARAMS})
export const hideInputParameters = () => dispatch => dispatch({type: types.TRIGGERS_ACTION_HIDE_PARAMS})

// Set input parameter value
// 
export const setInputParameter = (key, value) => dispatch => dispatch({type: types.TRIGGERS_ACTION_PARAMS_SET_VALUE, key, value})

// Set input parameter value
//
export const setTriggerInputParameter = (inputParams) => dispatch => dispatch({type: types.TRIGGERS_ACTION_INPUT_PARAMS_SET_VALUE, inputParams})

// Delete action
//
export const deleteAction = id => () => api.deleteActionById(id)

// Get dependencies
//
const getDependencies = async () => {
  const result = {
    retailers: getRetailers({ Skip: 0, Take: 999 }),
    languages: getLanguages(),
    businessRules: [],
    users: getAllUsers(),
    tradeItemCategories: getTradeItemCategories(),
    exportFormats: [],
    transportConfigurations: [],
    manufacturers: manufacturersApi.getManufacturers(),
  }
  for (const k in result) {
    result[k] = (await result[k]).data
  }
  return result
}

// Get export dependencies
//
const getExportDependencies = async () => {
  const result = {
    retailers: getRetailers({ Skip: 0, Take: 999 }),
    languages: getLanguages(),
    businessRules: [],
    users: getAllUsers(),
    tradeItemCategories: getTradeItemCategories(),
    exportFormats: [],
    transportConfigurations: getAllTransportConfigurations(),
    manufacturers: [],
    imageExportActions: api.getImageActionsLight(),
    targetMarkets: getTargetMarkets()
  }
  for (const k in result) {
    result[k] = (await result[k]).data
  }
  return result
}

// Load dependencies
//
export const loadDependencies = fn => async dispatch => {
  dispatch({ type: types.TRIGGERS_DEPENDENCIES_REQUEST })
  try {
    const deps = fn ? await fn() : await getDependencies()
    dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: deps })
  } catch (e) {
    dispatch({ type: types.TRIGGERS_DEPENDENCIES_FAILURE })
  }
}

export const loadExportDependencies = () => async dispatch => dispatch(loadDependencies(getExportDependencies))

export const getTransportConfigurations = () => (dispatch, getState) => {
  getAllTransportConfigurations().then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {transportConfigurations: res.data || []} ) }))
}

export const getExportFormatsByTradeItemCategory = tradeItemCategoryCode => (dispatch, getState) => {
  getFormatsByTradeItemCategory(tradeItemCategoryCode).then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {exportFormats: res.data || []} ) }))
}

export const getBusinessRulesSetsByTradeItemCategory = (taxonomyId, tradeItemCategoryCode) => (dispatch, getState) => {
  getByTaxonomyIdAndTradeItemCategoryCode(taxonomyId, tradeItemCategoryCode).then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {businessRules: res.data || []} ) }))
}

export const getManufacturers = () => (dispatch, getState) => {
  manufacturersApi.getManufacturers().then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {manufacturers: res.data || []} ) }))
}

export const getManufacturersEntities = () => (dispatch, getState) => {
  manufacturersApi.getManufacturerEntitiesLight().then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {manufacturersEntities: res.data || []} ) }))
}

export const getAllConnectorsLight = () => (dispatch, getState) => {
  getAllConnectors().then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {connectors: res.data || []} ) }))
}

export const getAllTaxonomies = () => (dispatch, getState) => {
  getTaxonomies().then(res => dispatch({ type: types.TRIGGERS_DEPENDENCIES_SUCCESS, resource: Object.assign( {}, selectors.getDependenciesObject(getState()), {taxonomies: res.data || []} ) }))
}

export const loadTradeItemCategoryDependencies = (taxonomyId, tradeItemCategoryCode) => (dispatch, getState) => {
  getExportFormatsByTradeItemCategory(tradeItemCategoryCode)(dispatch, getState)
  getBusinessRulesSetsByTradeItemCategory(taxonomyId, tradeItemCategoryCode)(dispatch, getState)
}

// precompute for export action
export const preComputeForExportAction = exportActionId => (dispatch, getState) => preComputingApi.preComputeForExportAction(exportActionId)


// Get export image actions dependencies
//
const getExportImageActionDependencies = async () => {
  const result = {
    imageCategories: importResourceApi.getImageCategories(),
    colorSpaces: importResourceApi.getImageColorSpaces(),
    transportConfigurations: getAllTransportConfigurations(),
  }
  for (const k in result) {
    result[k] = (await result[k]).data
  }
  return result
}

export const loadExportImageActionDependencies = () => async dispatch => dispatch(loadDependencies(getExportImageActionDependencies))

export const loadActionExecutionResults = () => (dispatch, getState) => {
  const filters = selectors.getActionExecutionResultsFilters(getState())
  return call(dispatch, () => api.getActionExecutionResultsLight(filters), {
    REQUEST: types.TRIGGERS_ACTION_EXECUTION_RESULT_REQUEST,
    FAILURE: types.TRIGGERS_ACTION_EXECUTION_RESULT_FAILURE
  }).then(data => {
    dispatch({ type: types.TRIGGERS_ACTION_EXECUTION_RESULT_SUCCESS, results: data.results })
    dispatch({ type: types.TRIGGERS_ACTION_EXECUTION_RESULT_TOTAL_RECEIVE, total: data.total })
  }
)}

export const resetActionExecutionResults = () => dispatch => dispatch({type: types.TRIGGERS_ACTION_EXECUTION_RESULT_RESET})

export const setActionExecutionResultsFilterKey = (key, value) => (dispatch, getState) => {
  dispatch({ type: types.TRIGGERS_ACTION_EXECUTION_RESULT_SET_FILTER_VALUE, key, value })
  return loadActionExecutionResults()(dispatch, getState)
}

export const setActionExecutionResultsFilters = filters => dispatch => dispatch({ type: types.TRIGGERS_ACTION_EXECUTION_RESULT_SET_FILTERS, filters })

export const getActionExecutionResult = actionExecutionResultId => dispatch => api.getActionExecutionResult(actionExecutionResultId).then(res => {
  dispatch({type: types.TRIGGERS_ACTION_EXECUTION_RESULT_DETAIL_RECEIVE, actionExecutionResult: res.data})
})

export const resetActionExecutionResult = () => dispatch => dispatch({type: types.TRIGGERS_ACTION_EXECUTION_RESULT_DETAIL_RESET})



// Get export trade item with image action
//
const getExportTradeItemWithImagesDependencies = async () => {
  const result = {
    exportPreComputedActions: api.getPreComputedExportActions(),
  }
  for (const k in result) {
    result[k] = (await result[k]).data
  }
  return result
}

const getExportTradeItemWithImagesMetadataDependencies = async () => {
  const result = {
    exportPreComputedActions: api.getPreComputedExportActions(),
    transportConfigurations: getAllTransportConfigurations(),
    exportFormats: getFormatsByTradeItemCategory('001')
  }
  for (const k in result) {
    result[k] = (await result[k]).data
  }
  return result
}

export const loadExportTradeItemWithImagesDependencies = () => async dispatch => dispatch(loadDependencies(getExportTradeItemWithImagesDependencies))

export const loadExportTradeItemWithImagesMetadataDependencies = () => async dispatch => dispatch(loadDependencies(getExportTradeItemWithImagesMetadataDependencies))


//Reset triggers dependencies
//
export const resetTriggersDependencies = () => dispatch => dispatch({type: types.TRIGGERS_DEPENDENCIES_RESET})