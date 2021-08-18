import { combineReducers } from "redux";
import createList from "../common/reducers/createList";
import * as types from "./types";
import createReducer from "../common/reducers/createReducer";

//Pre computed trade items list reducer
//
export const getDefaultFilters = () => {
  return {
    actionId: null,
    manufacturerId: null,
    tradeItemManufacturerCode: [],
    defaultLanguageCode: null,
    gtins: [],
    pageSize: 50,
    pageNumber: 0
  };
};

const list = {
  RESET: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_RESET,
  REQUEST: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_REQUEST,
  SUCCESS: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_SUCCESS,
  FAILURE: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_FAILURE,
  INVALIDATE: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_INVALIDATE
};

const itemShow = combineReducers({
  show: createReducer(false, {
    [types.APP_ITEM_MODAL_SHOW_SET]: (state, action) => action.show
  }),
  item: createReducer(null, {
    [types.APP_PRE_COMPUTED_TRADE_ITEM]: (state, action) => action.item
  })
});

const searchList = combineReducers({
  list: createList(list),
  total: createReducer(0, {
    [types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_TOTAL]: (state, action) =>
      action.total || 0
  }),
  filters: createReducer(getDefaultFilters(), {
    [types.APP_FILTER_VALUE_SET]: (state, action) =>
      action.filters || getDefaultFilters()
  })
});

// Combine reducer to get default reducer
//
export default combineReducers({
  searchList,
  itemShow
});
