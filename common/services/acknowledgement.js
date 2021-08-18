import axios from 'axios'
import * as env from '../../environment/index.js'

//========================== BEGIN AcknowledgementConfiguration =====================================
// Set the services URIs
const BASE_ACKNOLEDGEMENT_CONFIGURATION_SERVICE_URI = `${env.CDM_ACKNOWLEDGEMENT_SERVICE_URI}/api/AcknowledgementConfiguration`
const GET_PAGED_ACKNOLEDGEMENT_CONFIGURATION_URI = `${BASE_ACKNOLEDGEMENT_CONFIGURATION_SERVICE_URI}/GetPaged`

// Get matching rows
// filters (pageNumber, pageSize)
export const getAcknowledgementConfigurations = filters => axios.get(`${GET_PAGED_ACKNOLEDGEMENT_CONFIGURATION_URI}`, {
  params: filters
})
//========================== END AcknowledgementConfiguration =======================================





//========================== BEGIN TradeItemConflict =====================================
// Set the services URIs
const BASE_CONFLICTS_SERVICE_URI = `${env.CDM_ACKNOWLEDGEMENT_SERVICE_URI}/api/TradeItemConflict`
const GET_PAGED_CONFLICTS_URI = `${BASE_CONFLICTS_SERVICE_URI}/GetPaged`
const GET_HAS_CONFLICT_URI = `${BASE_CONFLICTS_SERVICE_URI}/HasConflict`
const RESOLVE_CONFLICTS_FORCING_URI = `${BASE_CONFLICTS_SERVICE_URI}/ResolveConflictByForcingValue`
const RESOLVE_CONFLICTS_UPDATING_URI = `${BASE_CONFLICTS_SERVICE_URI}/ResolveConflictByUpdatingValue`

// Get matching rows
// filters (pageNumber, pageSize)
export const getConflicts = filters => axios.get(`${GET_PAGED_CONFLICTS_URI}`, {
  params: filters
})

// Has conflict
export const hasConflict = (tradeItemId, retailerId) => axios.get(`${GET_HAS_CONFLICT_URI}`, {
  params: {
    tradeItemId,
    retailerId
  }
})

// Force the value we already have
export const forceConflict = conflictId => axios.put(`${RESOLVE_CONFLICTS_FORCING_URI}`, null, {
  params: {
    conflictId
  }
})

// Force the value we already have
export const updateConflict = conflictId => axios.put(`${RESOLVE_CONFLICTS_UPDATING_URI}`, null, {
  params: {
    conflictId
  }
})
//========================== END TradeItemConflict =======================================


//========================== BEGIN AcknowledgementConfiguration =====================================
// Set the services URIs
const BASE__SUBMISSION_SERVICE_URI = `${env.CDM_ACKNOWLEDGEMENT_SERVICE_URI}/api/Submission`
const GET_PAGED_SUBMISSION_SERVICE_URI = `${BASE__SUBMISSION_SERVICE_URI}/GetPaged`

// Get matching rows
// filters (pageNumber, pageSize)
export const getSubmissions = filters => axios.get(`${GET_PAGED_SUBMISSION_SERVICE_URI}`, {
  params: filters
})

// Get submission by id
export const getSubmissionById = submissionId => axios.get(`${BASE__SUBMISSION_SERVICE_URI}`, {
  params: { submissionId }
})
//========================== END AcknowledgementConfiguration =======================================