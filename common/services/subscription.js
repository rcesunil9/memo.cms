import axios from "axios"
import * as env from '../../environment/index.js'

// Set the services URIs
const BASE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/cms`
const OFFERS_URI = `${BASE_URI}/offer`
const CONNECTORS_URI = `${BASE_URI}/connector`
const CONNECTIONS_URI = `${BASE_URI}/connection`
const CREATE_MASS_CONNECTORS_URI = `${CONNECTORS_URI}/mass`
const DELETE_DRY_MASS_CONNECTORS_URI = `${CONNECTORS_URI}/mass/dry_run`
const DELETE_MASS_CONNECTORS_URI = `${CONNECTORS_URI}/mass`
const SUBSCRIPTIONS_URI = `${BASE_URI}/subscription`

// OFFERS
//
export const getOffers = () => axios.get(`${OFFERS_URI}`)

export const getOffer = id => axios.get(`${OFFERS_URI}/${id}`)

export const createOffer = offer => axios.post(`${OFFERS_URI}`, offer)

export const updateOffer = offer => axios.put(`${OFFERS_URI}`, offer)

export const deleteOffer = offerId => axios.delete(`${OFFERS_URI}`, { params: {offerId}})


// SUBSCRIPTIONS
//
export const getSubscriptions = (pageNumber, pageSize) => axios.get(`${SUBSCRIPTIONS_URI}/paged/${pageNumber || 0}/${pageSize || 0}`)

export const getSubscription = id => axios.get(`${SUBSCRIPTIONS_URI}/${id}`)

export const createSubscription = subscription => axios.post(`${SUBSCRIPTIONS_URI}`, subscription)

export const updateSubscription = subscription => axios.put(`${SUBSCRIPTIONS_URI}`, subscription)

export const getSubscriptionByManufacturerId = manufacturerId => axios.get(`${SUBSCRIPTIONS_URI}/manufacturer_id/${manufacturerId}`)

export const deleteSubscription = subscriptionId => axios.delete(`${SUBSCRIPTIONS_URI}`, { params: {subscriptionId}})



// CONNECTORS
//
export const getConnectors = (pageNumber, pageSize) => axios.get(`${CONNECTORS_URI}/details/paged/${pageNumber || 0}/${pageSize || 0}`)

export const getAllConnectors = () =>  axios.get(`${CONNECTORS_URI}/light`)

export const getConnector = id => axios.get(`${CONNECTORS_URI}/${id}`)

export const createConnector = connector => axios.post(`${CONNECTORS_URI}`, connector)

export const updateConnector = connector => axios.put(`${CONNECTORS_URI}`, connector)

export const deleteConnector = connectorId => axios.delete(`${CONNECTORS_URI}`, { params: {connectorId}})

export const createConnectorsInMass = values => axios.post(`${CREATE_MASS_CONNECTORS_URI}`, values)

export const dryDeleteConnectorsInMass = (manufacturerIds, retailerIds, targetMarketIds) => axios.delete(`${DELETE_DRY_MASS_CONNECTORS_URI}`, {data: {
    retailerIds,
    targetMarketIds
}})

export const deleteConnectorsInMass = (retailerIds, targetMarketIds) => axios.delete(`${DELETE_MASS_CONNECTORS_URI}`, {data: {
    retailerIds,
    targetMarketIds
}})


// CONNECTIONS
//
export const getConnections = (pageNumber, pageSize) => axios.get(`${CONNECTIONS_URI}/details/paged/${pageNumber || 0}/${pageSize || 0}`)

export const getConnection = id => axios.get(`${CONNECTIONS_URI}/${id}`)

export const createConnection = connection => axios.post(`${CONNECTIONS_URI}`, connection)

export const updateConnection = connection => axios.put(`${CONNECTIONS_URI}`, connection)

export const deleteConnection = connectionId => axios.delete(`${CONNECTIONS_URI}`, { params: {connectionId}})

export const createConnectionsInMass = (manufacturerIds, connectorIds, status, releaseDate) => axios.post(`${CONNECTIONS_URI}/mass`, {
    manufacturerIds,
    connectorIds,
    status,
    releaseDate
})

export const dryDeleteConnectionsInMass = (manufacturerIds, connectorIds) => axios.delete(`${CONNECTIONS_URI}/mass/dry_run`, {data: {
    manufacturerIds,
    connectorIds,
}})

export const deleteConnectionsInMass = (manufacturerIds, connectorIds) => axios.delete(`${CONNECTIONS_URI}/mass`, {data: {
    manufacturerIds,
    connectorIds,
}})

export const getConnectionsByConnectorIds = (connectorIds) => axios.get(`${CONNECTIONS_URI}/getConnectionsByConnectorIds`, { params: {
    connectorIds
}})