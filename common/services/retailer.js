import axios from "axios"
import * as env from '../../environment/index.js'

// Set the services URIs
const RETAILERS_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/Retailer`
const RETAILERS_ALL_BASE_URI = `${RETAILERS_BASE_URI}/all`
const GROUPS_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/Group`
const ENRICHMENT_CONF_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/EnrichmentConfiguration`

// Get retailers
//
export const getRetailers = ({ Skip, Take }) =>
  axios.get(`${RETAILERS_BASE_URI}`, { params: { Skip, Take } })

// Get all retailers
export const getAllRetailers = () =>
  axios.get(`${RETAILERS_ALL_BASE_URI}`)

// Get retailer by ID
//
export const getRetailerById = id => axios.get(`${RETAILERS_BASE_URI}/${id}`)

// Update retailer
//
export const updateRetailer = retailer =>
  axios.put(`${RETAILERS_BASE_URI}`, retailer, { params: { id: retailer.id } })

// Create retailer
//
export const createRetailer = retailer => axios.post(`${RETAILERS_BASE_URI}`, retailer)

// Delete retailer by ID
//
export const deleteRetailerById = id => axios.delete(`${RETAILERS_BASE_URI}/${id}`)

// Get groups
//
export const getGroups = () => axios.get(`${GROUPS_BASE_URI}`)

// Create group
//
export const createGroup = group => axios.post(`${GROUPS_BASE_URI}`, group)

// Update group
//
export const updateGroup = group => axios.put(GROUPS_BASE_URI, group, { params: { id: group.id } })

// Get enrichment conf. by retailer ID
//
export const getEnrichmentConfigurationsByRetailerId = id => axios.get(`${ENRICHMENT_CONF_BASE_URI}/GetByRetailerId`, { params: { id } }) 

// Get enrichment conf. by ID
//
export const getEnrichmentConfigurationsById = id => axios.get(`${ENRICHMENT_CONF_BASE_URI}/${id}`) 

// Create enrichment configuration
//
export const createEnrichmentConfiguration = enrichmentConfiguration => axios.post(`${ENRICHMENT_CONF_BASE_URI}`, enrichmentConfiguration)

// Update enrichment configuration
//
export const updateEnrichmentConfiguration = (id, enrichmentConfiguration) => axios.put(`${ENRICHMENT_CONF_BASE_URI}/${id}`, enrichmentConfiguration)

// Delete enrichment configuration
//
export const deleteEnrichmentConfiguration = id => axios.delete(`${ENRICHMENT_CONF_BASE_URI}/${id}`)