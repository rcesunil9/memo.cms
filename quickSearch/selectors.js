import { createSelector } from 'reselect'
import { getResults } from "../common/reducers/createList"
import keyBy from "lodash/keyBy"

const getTradeItems = state => state.quickSearch.tradeItems

export const isDisplayed = state => state.quickSearch.isDisplayed

export const getQuickSearchValue = state => state.quickSearch.filters.value

export const getTradeItemsById = createSelector(
  getTradeItems,
  tradeItems => keyBy(getResults(tradeItems), "tradeItemId")
)
