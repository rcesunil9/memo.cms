import { createSelector } from 'reselect'
import { getResource, getIsFetching } from "../common/reducers/createResource"

const getUser = state => state.auth.user

export const getToken = state => state.auth.token
export const getAuthenticatedUser = createSelector(
  getUser,
  user => getResource(user)
)
export const isAuthenticating = createSelector(
  getUser,
  user => getIsFetching(user)
)
