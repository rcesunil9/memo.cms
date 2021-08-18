import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const ENRICHMENT_BASE_URI = `${env.CDM_ENRICHMENT_SERVICE_URI}/api/RequestedTradeItem`
const GET_MATCHING_ROWS_URI = `${ENRICHMENT_BASE_URI}/GetPaged`
const IGNORE_URI = `${ENRICHMENT_BASE_URI}/ignore`
const UNIGNORE_URI = `${ENRICHMENT_BASE_URI}/unignore`
const MATCH_URI = `${ENRICHMENT_BASE_URI}/match`
const EXPORT_CSV_URI = `${ENRICHMENT_BASE_URI}/exportCsv`

// Get matching rows
export const getMatchingRows = filters => axios.get(`${GET_MATCHING_ROWS_URI}`, {
  params: filters
})

// Ignore
export const ignore = requestedTradeItemId => axios.put(`${IGNORE_URI}`, null, {params: {requestedTradeItemId}})

// Unignore
export const unignore = requestedTradeItemId => axios.put(`${UNIGNORE_URI}`, null, {params: {requestedTradeItemId}})

// Match
export const match = (requestedTradeItemId, tradeItemId) => axios.put(`${MATCH_URI}`, null, {params: {
  requestedTradeItemId,
  tradeItemId
}})

// Export CSV
export const exportCsv = filters => {return axios.post(`${EXPORT_CSV_URI}`, null, {params: filters})}