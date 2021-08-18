import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
//
// Manufacturer
//
const MANUFACTURERS_BASE_URI = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/Manufacturer`

// Get all manufacturers
//
export const getManufacturers = () => axios.get(`${MANUFACTURERS_BASE_URI}`)

// Get manufacturer by id
//
export const getManufacturerById = (id) => axios.get(`${MANUFACTURERS_BASE_URI}/${id}`)

// Update manufacturer by id
//
export const saveManufacturerById = (id, manufacturer) => axios.put(`${MANUFACTURERS_BASE_URI}/${id}`, manufacturer)

// Create manufacturer
//
export const createManufacturer = (manufacturer) => axios.post(`${MANUFACTURERS_BASE_URI}`, manufacturer)

// Delete a manufacturer
//
export const deleteManufacturerById = (id) => axios.delete(`${MANUFACTURERS_BASE_URI}/${id}`)


// Manufacturer entity
//
const MANUFACTURER_ENTITIES_BASE_URI = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/ManufacturerEntity`
const MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID = `${MANUFACTURER_ENTITIES_BASE_URI}/GetByManufacturerId`
const MANUFACTURER_ENTITIES_GET_LIGHT = `${MANUFACTURER_ENTITIES_BASE_URI}/GetLight`
const MANUFACTURER_ENTITIES_GET_IMAGE_CATEGORIES = `${MANUFACTURER_ENTITIES_BASE_URI}/GetImageCategories`

// Get all manufacturers entities
//
export const getManufacturerEntities = () => axios.get(`${MANUFACTURER_ENTITIES_BASE_URI}`)

// Get all manufacturers entities (light)
//
export const getManufacturerEntitiesLight = (value) => axios.get(`${MANUFACTURER_ENTITIES_GET_LIGHT}`)

// Get manufacturer entity by id
//
export const getManufacturerEntityById = (id) => axios.get(`${MANUFACTURER_ENTITIES_BASE_URI}/${id}`)

// Get manufacturer entity by manufacturer id
//
export const getManufacturerEntitiesByManufacturerId = (manufacturerId) => axios.get(`${MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID}/${manufacturerId}`)

// Update manufacturer entity by id
//
export const saveManufacturerEntityById = (id, manufacturerEntity) => axios.put(`${MANUFACTURER_ENTITIES_BASE_URI}/${id}`, manufacturerEntity)

// Create manufacturer entity
//
export const createManufacturerEntity = (manufacturerEntity) => axios.post(`${MANUFACTURER_ENTITIES_BASE_URI}`, manufacturerEntity)

// Delete a manufacturer entity
//
export const deleteManufacturerEntityById = (id) => axios.delete(`${MANUFACTURER_ENTITIES_BASE_URI}/${id}`)

export const getImageCategories = () => axios.get(`${MANUFACTURER_ENTITIES_GET_IMAGE_CATEGORIES}`)
