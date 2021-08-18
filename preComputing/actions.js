import * as api from "../common/services/preComputing";
import * as types from "./types";
import call from "../common/actions/call";
import get from "lodash/get";
import { getDefaultFilters } from "./reducer";

export const getPreComputedTradeItems = filter => dispatch =>
  call(dispatch, () => api.getPreComputedTradeItems(filter), {
    REQUEST: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_REQUEST,
    FAILURE: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_FAILURE
  }).then(results => {
    
    dispatch({
      type: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_SUCCESS,
      results: get(results, "results", [])
    });
    dispatch({
      type: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_TOTAL,
      total: get(results, "total", 0)
    });
  });

export const resetPreComputedTradeItems = () => dispatch =>
  dispatch({ type: types.APP_PRE_COMPUTED_TRADE_ITEMS_LIST_RESET });

// set the filters & update the matching rows list
export const setFilter = filters => dispatch =>
  dispatch({ type: types.APP_FILTER_VALUE_SET, filters });
export const resetFilters = mergeFilters => dispatch => {
  const newFilters = Object.assign({}, getDefaultFilters(), mergeFilters || {});
  dispatch(setFilter(newFilters));
  dispatch(getPreComputedTradeItems(newFilters));
};
export const updateFilters = filters => dispatch => {
  setFilter(filters)(dispatch);
  getPreComputedTradeItems(filters)(dispatch);
};

export const showTradeItem = show => dispatch =>
  dispatch({ type: types.APP_ITEM_MODAL_SHOW_SET, show });
export const setTradeItem = item => dispatch =>
  dispatch({ type: types.APP_PRE_COMPUTED_TRADE_ITEM, item });
