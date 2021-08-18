import axios from "axios"
import * as env from "../../environment/index.js"

// Set the services URIs
const ACTIONS_BASE_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE_URI}/api/Action`
const ACTIONS_EXECUTION_RESULT_BASE_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE_URI}/api/ActionExecutionResult`
const LAUNCH_ACTIONS_URI = `${ACTIONS_BASE_URI}/LaunchAction`
const TRIGGERS_BASE_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE_URI}/api/Trigger`
const LAUNCH_TRIGGER = `${TRIGGERS_BASE_URI}/ExecutePeriodicTrigger`

// Get actions
//
export const getActions = () => axios.get(ACTIONS_BASE_URI)

// Get actions light
//
export const getActionsLight = () => axios.get(`${ACTIONS_BASE_URI}/GetLight`)

// Get image actions light
//
export const getImageActionsLight = () => axios.get(`${ACTIONS_BASE_URI}/GetLightExportTradeItemImageActions`)

// Get export precomputed action by scope
//
export const getExportActionsByTradeItemCategory = tradeItemCategoryCode => axios.get(`${ACTIONS_BASE_URI}/GetLightExportPreComputedTradeItemActionsByTradeItemCategory`, {
  params: {
    tradeItemCategoryCode
  }
})

// Get export precomputed actions
//
export const getExportActions = () => axios.get(`${ACTIONS_BASE_URI}/GetExportTradeItemsWithImagesActions`)

// Get export precomputed actions with Images
//
export const getPreComputedExportActions = () => axios.get(`${ACTIONS_BASE_URI}/GetExportPreComputedTradeItemActions`)

// Get action by ID
//
export const getActionById = id => axios.get(`${ACTIONS_BASE_URI}/${id}`)

// Delete action by ID
//
export const deleteActionById = id => axios.delete(`${ACTIONS_BASE_URI}/${id}`)

// Create action
//
export const createAction = action => {
  const url = `${ACTIONS_BASE_URI}/Create/${action.discriminator}`
  return axios.post(url, action)
}

// Update action
export const updateAction = action => {
  if (!action.id) throw new Error("missing id")
  const url = `${ACTIONS_BASE_URI}/Update/${action.discriminator}`
  return axios.put(url, action, { params: { id: action.id } })
}

// launch an action
export const launchAction = (actionId, parameters) => axios.put(LAUNCH_ACTIONS_URI, parameters, { params: { actionId } })

// get action results
export const getActionExecutionResultsLight = filters => axios.get(`${ACTIONS_EXECUTION_RESULT_BASE_URI}/GetLightActionExecutionResults`, {
  params: filters
})

// get single action execution result
export const getActionExecutionResult = actionExecutionResultId => axios.get(`${ACTIONS_EXECUTION_RESULT_BASE_URI}/${actionExecutionResultId}`)


// POST
// /api/Action/Create/ExportPreComputedTradeItemActionViewModel
// POST
// /api/Action/Update/ExportPreComputedTradeItemActionViewModel
// POST
// /api/Action/Create/SendEmailActionViewModel
// POST
// /api/Action/Update/SendEmailActionViewModel

// Get triggers
//
export const getTriggers = () => axios.get(TRIGGERS_BASE_URI)

// Get triggers light
//
export const getTriggersLight = () => axios.get(`${TRIGGERS_BASE_URI}/GetLight`)

// Get trigger by ID
//
export const getTriggerById = id => axios.get(`${TRIGGERS_BASE_URI}/${id}`)

// Delete trigger by ID
//
export const deleteTriggerById = id => axios.delete(`${TRIGGERS_BASE_URI}/${id}`)

// POST
// /api/Trigger/Create/PeriodicTriggerViewModel
// PUT
// /api/Trigger/Update/PeriodicTriggerViewModel/{triggerId}
// POST
// /api/Trigger/Create/NewFileOnFTPTriggerViewModel
// PUT
// /api/Trigger/Update/NewFileOnFTPTriggerViewModel/{triggerId}
export const createTrigger = trigger => {
  const url = `${TRIGGERS_BASE_URI}/Create/${trigger.discriminator}`
  return axios.post(url, trigger)
}

export const updateTrigger = trigger => {
  const id = trigger.id
  if (!id) throw new Error("Missing id")
  const url = `${TRIGGERS_BASE_URI}/Update/${trigger.discriminator}/${id}`
  return axios.put(url, trigger)
}

// launch an action
export const launchTrigger = (triggerId) => axios.get(`${LAUNCH_TRIGGER}/${triggerId}`)

// test()
