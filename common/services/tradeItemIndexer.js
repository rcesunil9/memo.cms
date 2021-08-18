import axios from 'axios'
import qs from 'qs'
import * as env from '../../environment/index.js'

// Set the services URIs
//
const SUGGEST = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/suggest`
const SEARCH = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/search`
const FULL_SEARCH = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/fullsearch`
const INDEX_ALL = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/IndexAll`
const INDEX_BY_ID = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/IndexByTradeItemId`
const INDEX_BY_GTIN = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/IndexByGtin`

// Suggest a product for autocomplete
//
export const suggest = (lang, value) => axios.get(`${SUGGEST}/${lang}/${value}`)

//Indexer search
//
export const search = (lang, filters) => {
 let params = Object.assign({}, filters, {keyword: filters.keyword || null})
 return axios.get(`${SEARCH}/${lang}`, {
   params,
   paramsSerializer: params => qs.stringify(params, {arrayFormat: 'indices'})
 })
}

// Full indexer search
//
export const fullsearch = (lang, filters) => {
  let params = Object.assign({}, filters, {searchAfter: null})
  return axios.get(`${FULL_SEARCH}/${lang}`, {
    params: params
  })
}

// index all products
//
export const indexAll = () => axios.put(`${INDEX_ALL}`)

// index by trade item id
//
export const indexByTradeItemId = tradeItemId  => axios.put(`${INDEX_BY_ID}`, null, {
  params: {
    tradeItemId
  }
})

// index by gtin
//
export const indexByGtin = gtin  => axios.put(`${INDEX_BY_GTIN}`, null, {
  params: {
    gtin
  }
})