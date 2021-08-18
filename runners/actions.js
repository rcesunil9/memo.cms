import * as types from "./types"

// loading runner
//
export const addLoadingRunner = () => dispatch => dispatch({type: types.APP_RUNNERS_LOADING_AWAITING_ADD})
export const removeLoadingRunner = () => dispatch => dispatch({type: types.APP_RUNNERS_LOADING_AWAITING_REMOVE})
export const resetLoadingRunner = () => dispatch => dispatch({type: types.APP_RUNNERS_LOADING_AWAITING_RESET})

