import axios from 'axios'
import debounce from 'lodash/debounce'
import * as env from '../../environment/index.js'


//========================== BEGIN PreComputingJob =====================================
// Set the services URIs
const BASE_PRE_COMPUTING_JOB_SERVICE_URI = `${env.CDM_PRE_COMPUTING_SERVICE_URI}/api/PreComputingJob`
const GET_PRE_COMPUTING_JOB_URI = `${BASE_PRE_COMPUTING_JOB_SERVICE_URI}`
const PRE_COMPUTE_FOR_JOB_URI = `${BASE_PRE_COMPUTING_JOB_SERVICE_URI}/PreComputeForJob`
const PRE_COMPUTE_FOR_EXPORT_ACTION_URI = `${BASE_PRE_COMPUTING_JOB_SERVICE_URI}/PreComputeForExportAction`
const PRE_COMPUTE_FOR_TRADE_ITEM_URI = `${BASE_PRE_COMPUTING_JOB_SERVICE_URI}/PreComputeForTradeItem`


// Get all paged pre computing jobs
export const getPreComputingJobs = filters => axios.get(`${GET_PRE_COMPUTING_JOB_URI}`, {
  params: filters
})

// Get one pre computing job
export const getPreComputingJob = preComputingJobId => axios.get(`${GET_PRE_COMPUTING_JOB_URI}/${preComputingJobId}`)

// Pre compute for job
export const preComputeForJob = preComputingJobId => axios.post(`${PRE_COMPUTE_FOR_JOB_URI}`, null, {
  params: {
    preComputingJobId
  }
})

// Pre compute for action
export const preComputeForExportAction = exportActionId => axios.post(`${PRE_COMPUTE_FOR_EXPORT_ACTION_URI}`, null, {
  params: {
    exportActionId
  }
})

// Pre compute for trade item
export const preComputeForTradeItem = tradeItemId => axios.post(`${PRE_COMPUTE_FOR_TRADE_ITEM_URI}`, null, {
  params: {
    tradeItemId
  }
})
//========================== END PreComputingJob =======================================

//========================= Pre Computed Trade Items====================
// Set the services URIs
const BASE_PRE_COMPUTING_TRADE_ITEM_SERVICE_URI = `${env.CDM_PRE_COMPUTING_SERVICE_URI}/api/TradeItem`
const BASE_PAGED_PRE_COMPUTING_TRADE_ITEM_SERVICE_URI = `${BASE_PRE_COMPUTING_TRADE_ITEM_SERVICE_URI}/SearchPagedPreComputedTradeItems`

// Get preComputed Trade items
export const getPreComputedTradeItems = debounce(filters =>
  axios.post(`${BASE_PAGED_PRE_COMPUTING_TRADE_ITEM_SERVICE_URI}?pageNumber=${filters.pageNumber}&pageSize=${filters.pageSize}`, filters), 1000, { leading: true, trailing: true })

// get precomputed trade item for export action
export const getPreComputedTradeItemByTradeItemIdAndExportActionId = (tradeItemId, exportPreComputedTradeItemActionId) => axios.get(`${BASE_PRE_COMPUTING_TRADE_ITEM_SERVICE_URI}/GetByTradeItemIdAndExportActionId`, {
  params: {
    tradeItemId,
    exportPreComputedTradeItemActionId 
  }
})
//========================= END Pre Computed Trade Items====================


export const getTradeItemsPrecomputingStatus = tradeItemIds => axios.get(`${env.CDM_PRE_COMPUTING_SERVICE_URI}/api/TradeItemPreComputingResult/GetTradeItemStatus`, {
  params: {
    tradeItemIds
  }
})




