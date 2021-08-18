import { combineReducers } from "redux"
import dotProp from "dot-prop-immutable"
import createReducer from "./createReducer"
import createIsFetching from "./createIsFetching"
import createDidInvalidate from "./createDidInvalidate"
import isArray from "lodash/isArray"

export const createResults = ({ SUCCESS, RESET, REMOVE, UPDATE }) => createReducer([], {
  [SUCCESS]: (state, action) => action.push ? (isArray(action.push) ? [...state, ...action.push] : [...state, action.push]) : (action.results || []),
  [RESET]: (state, action) => [],
  [REMOVE]: (state, action) => state.filter((item, index) => (action.index ? index !== action.index : item[action.key] !== action.value)),
  [UPDATE]: (state, action) => dotProp.set(state, action.key, action.value),
})

const createList = actionTypes => combineReducers({
  results: createResults(actionTypes),
  isFetching: createIsFetching(actionTypes),
  didInvalidate: createDidInvalidate(actionTypes)
})

export default createList

export const getResults = state => state.results
export const getIsFetching = state => state.isFetching
export const getDidInvalidate = state => state.didInvalidate
