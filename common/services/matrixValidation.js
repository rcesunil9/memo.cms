import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const MATRIX_VALIDATION_BASE_URI = `${env.CDM_MATRIX_VALIDATION_URI}/api/MappingFailedResult`
const GET_PAGED_MAPPING_FAILED_RESULT = `${MATRIX_VALIDATION_BASE_URI}/GetPagedByContextId`

export const getPagedMappingFailedResult = (contextId, {pageNumber, pageSize, gtin, tradeItemManufacturerCode}) => axios.get(`${GET_PAGED_MAPPING_FAILED_RESULT}`, {
  params: {
    contextId,
    pageNumber,
    pageSize,
    gtin,
    tradeItemManufacturerCode
  }
})