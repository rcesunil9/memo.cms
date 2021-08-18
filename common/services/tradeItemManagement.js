import axios from 'axios'
import * as env from '../../environment/index.js'

const BASE_TRADE_ITEM_MANAGEMENT_URI = `${env.CDM_TRADE_ITEM_MANAGEMENT_URI}/api/tradeitemmanagement`
const GET_BY_TRADE_ITEM_ID = `${BASE_TRADE_ITEM_MANAGEMENT_URI}/Get`

// get by trade item id
//
export const getByTradeItemId = (tradeItemId) => axios.get(`${GET_BY_TRADE_ITEM_ID}/${tradeItemId}`)