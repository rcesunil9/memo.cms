import axios from 'axios'
import * as env from '../../environment/index.js'
import get from 'lodash/get'

// Set the services URIs
//
// Trade item storage
//
const STORAGE_BASE_URI = `${env.CDM_TRADE_ITEM_STORAGE_URI}/api/Cms`

// Get trade item by id
//
export const getTradeItemById = (tradeItemId): Promise<*> => axios.get(`${STORAGE_BASE_URI}/${tradeItemId}`)

// Update trade item by id
//
export const saveTradeItemById = (id, tradeItem): Promise<*> => axios.put(`${STORAGE_BASE_URI}/${id}`, tradeItem)

//Save trade item
export const saveTradeItem = (tradeItem) => axios.put(`${STORAGE_BASE_URI}/${get(tradeItem, 'tradeItemId', null)}`, tradeItem)

//Create trade item
export const createTradeItem = (tradeItem) => axios.post(STORAGE_BASE_URI, tradeItem)

//Delete trade item
export const deleteTradeItem = (tradeItemId) => axios.delete(STORAGE_BASE_URI, {
  params: {
    tradeItemId
  }
})

// Delete a manufacturer entity
//
export const deleteTradeItemById = (id): Promise<*> => axios.delete(`${STORAGE_BASE_URI}/${id}`)

// PersistenceResult
//
const PERSISTENCE_BASE_URI = `${env.CDM_TRADE_ITEM_STORAGE_URI}/api/PersistenceResult`
const GET_PAGED_PERSISTENCE_RESULT = `${PERSISTENCE_BASE_URI}/GetPaged`
const GET_PERSISTENCE_BY_TRADE_ITEM = `${PERSISTENCE_BASE_URI}/GetByTradeItem`

export const getPagedPersistenceResult = (contextId, pageNumber, pageSize) => axios.get(`${GET_PAGED_PERSISTENCE_RESULT}`, {
  params: {
    contextId,
    pageNumber,
    pageSize
  }
})

export const getPersistenceTradeItemById = (contextId, tradeItemId) => axios.get(`${GET_PERSISTENCE_BY_TRADE_ITEM}`, {
  params: {
    contextId,
    tradeItemId
  }
})