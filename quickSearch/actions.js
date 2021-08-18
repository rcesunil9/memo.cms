import * as types from './types'
import * as tradeItemsApi from "../common/services/tradeItemIndexer"
import call from "../common/actions/call"

// search trade items
//
const quickSearchTradeItems = (lang, value) => async dispatch => call(dispatch, () => tradeItemsApi.search(lang, {
  keyword: value,
  limit: 6,
  aggregate: true
}), {
  REQUEST: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_RESET,
  FAILURE: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_FAILURE,
}).then(res => {
  dispatch({type: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_SUCCESS, results: res.results})
})

// quick search
// for now, only on trade items
//
export const quickSearch = (lang, value) => async dispatch => {
  const tradeItemsPromise = quickSearchTradeItems(lang, value)(dispatch)
  tradeItemsPromise.then(res => setQuickSearchValue(value)(dispatch))
}

// quick search value received
//
export const setQuickSearchValue = (value) => async dispatch => dispatch({type: types.APP_QUICK_SEARCH_VALUE_RECEIVE, value})

// reset the search
//
export const resetQuickSearch = () => async dispatch => {
  toggleDisplay()(dispatch)
  dispatch({type: types.APP_QUICK_SEARCH_VALUE_RECEIVE})
  dispatch({type: types.APP_QUICK_SEARCH_TRADE_ITEMS_LIST_RESET})
}

// toggle quick search display view
//
export const toggleDisplay = () => async dispatch => dispatch({type: types.APP_QUICK_SEARCH_TOGGLE_DISPLAY})
