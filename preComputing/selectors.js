import { createSelector } from 'reselect'
import { getResults } from '../common/reducers/createList'

const _getPreComputedTradeItems = state => state.preComputing.searchList.list
export const getItemViewShow = (state) => state.preComputing.itemShow
export const getFilters = (state) => state.preComputing.searchList.filters

export const getTotal = (state) => state.preComputing.searchList.total
export const getPreComputedTradeItems = createSelector(_getPreComputedTradeItems, getResults)