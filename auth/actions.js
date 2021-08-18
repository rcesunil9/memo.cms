import * as api from '../common/services/auth'
import * as types from './types'

// Authenticate a user
//
export const login = (data, history) => (dispatch : Function) => {
   dispatch({type: types.APP_AUTH_USER_REQUEST})
   return api.login(data)
     .then(res => {
        localStorage.setItem('token', res.data.access_token)
        dispatch({type: types.APP_AUTH_TOKEN_RECEIVE, token: res.data.access_token})
        return api.getUser()
          .then(userData => {
            localStorage.setItem('user', JSON.stringify(userData.data))
            setAuthenticatedUser(userData.data)(dispatch)
            history.push('/')
          })
          .catch( e => {
            dispatch({type: types.APP_AUTH_USER_FAILURE})
            console.error(e)
          })
     })
     .catch( e => {
       dispatch({type: types.APP_AUTH_USER_FAILURE})
       console.error(e)
     })
 }

// Log a user out
//
export const logout = () => (dispatch : Function) => {
  dispatch({type: types.APP_AUTH_USER_RESET})
  dispatch({type: types.APP_AUTH_TOKEN_RECEIVE})
  localStorage.setItem('token', null);
  localStorage.setItem('user', null);
  window.location.href = `/`
}

// Set user
//
export const setAuthenticatedUser = (user) => async dispatch => dispatch({type: types.APP_AUTH_USER_SUCCESS, user})
