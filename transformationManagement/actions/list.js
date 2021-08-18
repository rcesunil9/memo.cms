import get from "lodash/get"
import * as api from '../../common/services/transformationManagement'
import * as types from '../types'
import call from "../../common/actions/call"

// get list of transformations
export const getList = (filters) => dispatch => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_LIST_FILTERS_RECEIVE, filters})
    return call(dispatch, () => api.getTransformationSetsPaged(filters), {
        REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_LIST_REQUEST,
        FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_LIST_FAILURE,
    }).then(results => {
        dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_LIST_SUCCESS, results: get(results, "items", [])})
        dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_LIST_TOTAL_RECEIVE, total: get(results, "totalItems", 0)})
    })
}
