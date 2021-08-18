import * as api from '../common/services/action'
import * as types from './types'
import call from "../common/actions/call"

// an action
export const getListing = () => dispatch => call(dispatch, api.getListing, {
  REQUEST: types.ACTION_LIST_REQUEST,
  FAILURE: types.ACTION_LIST_FAILURE,
}).then(results => dispatch({type: types.ACTION_LIST_SUCCESS, results: results}))

