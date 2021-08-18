import { combineReducers } from "redux"
import createReducer from "./createReducer"
import createIsFetching from "./createIsFetching"
import createDidInvalidate from "./createDidInvalidate"

const createResource = ({ SUCCESS, RESET }) => createReducer(null, {
  [SUCCESS]: (state, action) => action.resource || null,
  [RESET]: (state, action) => null,
})

const createResourceHandler = actionTypes => combineReducers({
  resource: createResource(actionTypes),
  isFetching: createIsFetching(actionTypes),
  didInvalidate: createDidInvalidate(actionTypes)
})

export default createResourceHandler

export const getResource = state => state.resource
export const getIsFetching = state => state.isFetching
export const getDidInvalidate = state => state.didInvalidate
