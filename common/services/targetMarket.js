import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
//
// Target market
//
const TARGET_MARKET_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/targetmarket`

export const getTargetMarkets = () => axios.get(`${TARGET_MARKET_BASE_URI}`)
export const getTargetMarketById = (id) => axios.get(`${TARGET_MARKET_BASE_URI}/${id}`)
export const saveTargetMarketById = (id, targetMarket) => axios.put(`${TARGET_MARKET_BASE_URI}/${id}`, targetMarket)
export const deleteTargetMarketById = (id) => axios.delete(`${TARGET_MARKET_BASE_URI}/${id}`)

// Countries
//
const COUNTRY_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/country`

export const getCountries = (value) => axios.get(`${COUNTRY_BASE_URI}`)
export const getCountryById = (id) => axios.get(`${COUNTRY_BASE_URI}/${id}`)
export const saveCountryById = (id, country) => axios.put(`${COUNTRY_BASE_URI}/${id}`, country)
export const deleteCountryById = (id) => axios.delete(`${COUNTRY_BASE_URI}/${id}`)

// Languages
//
const LANGUAGE_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/language`

export const getLanguages = (value) => axios.get(`${LANGUAGE_BASE_URI}`)
export const getLanguageById = (id) => axios.get(`${LANGUAGE_BASE_URI}/${id}`)
export const saveLanguageById = (id, country) => axios.put(`${LANGUAGE_BASE_URI}/${id}`, country)
export const deleteLanguageById = (id) => axios.delete(`${LANGUAGE_BASE_URI}/${id}`)
