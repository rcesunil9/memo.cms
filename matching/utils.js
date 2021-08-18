import update from "immutability-helper"
import get from "lodash/get"
import { date } from "../common/utils/date"
import { getDefaultTradeItem } from "../tradeItems/utils"

export const getDefaultMatchingRowsFilters = () => { return {
    pageSize: 50,
    pageNumber: 0,
    orderBy: null,
    orderDirection: null,
    startDate: date().subtract(1, 'months').format('YYYY-MM-DD'),
    endDate: null,
    manufacturerId: null,
    retailerIds: [],
    matched: false,
    ignored: false,
    gtin: null,
}}

export const getTradeItemFromMatching = requestedTradeItem => update(getDefaultTradeItem(), {
  gtin: {$set: get(requestedTradeItem, "gtin", null)},
  defaultLanguageCode: {$set: get(requestedTradeItem, "languageCode", null)},
  marketing: {$push: [{
    values: {
      title: get(requestedTradeItem, "title", null)
    }
  }]},
})
