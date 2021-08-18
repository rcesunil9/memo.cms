import filter from "lodash/filter"
import createReducer from "../common/reducers/createReducer"
import * as types from "./types"

export default createReducer([], {
  [types.NOTIFICATIONS_ADD]: (state, action) => [...state, action.notification],
  [types.NOTIFICATIONS_REMOVE]: (state, action) => filter(state, n => n !== action.notification)
})
