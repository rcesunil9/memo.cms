import axios from 'axios'
import './index'
import qs from 'qs'
import update from 'immutability-helper'
import * as env from '../../environment/index.js'

// Set the services URIs
//
const LOGIN = `${env.CDM_AUTH_URI}/connect/token`
const GET_USER = `${env.CDM_AUTH_URI}/connect/userinfo`

// Call Authentication service and get a bearer token
//
export const login = (query): Promise<*> => {
  let params = update(query, {
    client_id: {$set: env.CDM_AUTH_CLIENT_ID},
    client_secret: {$set: env.CDM_AUTH_CLIENT_SECRET},
    grant_type: {$set: env.CDM_AUTH_GRANT_TYPE}
  })
  return axios.post(LOGIN, qs.stringify(params))
}

// Get user information
//
export const getUser = (): Promise<*> => axios.get(GET_USER)
