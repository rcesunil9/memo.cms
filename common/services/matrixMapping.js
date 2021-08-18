import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const MATRIX_MAPPING_BASE_URI = `${env.CDM_MATRIX_MAPPING_URI}/api/MatrixMapping`
const GET_MAPPINGS = `${MATRIX_MAPPING_BASE_URI}/getMappingsLight`
const GET_MAPPING_BY_ID = `${MATRIX_MAPPING_BASE_URI}/getMapping`
const GET_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/GetMatrixAnalysis`
const PUT_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/UpdateStandardMapping`
const PUT__NON_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/UpdateNonStandardMapping`
const POST_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/CreateStandardMapping`
const POST_NON_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/CreateNonStandardMapping`
const DELETE_MAPPING = `${MATRIX_MAPPING_BASE_URI}`
const UPLOAD_FILE = `${MATRIX_MAPPING_BASE_URI}/UploadFile`
const SAVE_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/SaveMatrixAnalysis`
const STANDARD_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/StandardMatrixAnalysis`

// Get all manufacturers entities
export const getMatrixMappings = () => axios.get(`${GET_MAPPINGS}`)

// Get mapping by id
export const getMappingById = (mappingId) => axios.get(`${GET_MAPPING_BY_ID}`, {
  params: {
    mappingId
  }
})

// Get matrix analysis
export const getNonStandardMatrixAnalysis = (matrixAnalysisId) => axios.get(`${GET_MATRIX_ANALYSIS}`, {
  params: {
    matrixAnalysisId
  }
})

// Create standard mapping
export const getStandardMatrixAnalysis = () => axios.get(STANDARD_MATRIX_ANALYSIS)

// Create standard mapping
export const createNonStandardMapping = (mapping) => axios.post(`${POST_NON_STANDARD_MAPPING}`, mapping)

// Update non-standard mapping
export const updateNonStandardMapping = (id, mapping) => axios.put(`${PUT__NON_STANDARD_MAPPING}/${id}`, mapping)

// Create standard mapping
export const createStandardMapping = (mapping) => axios.post(`${POST_STANDARD_MAPPING}`, mapping)

// Update non-standard mapping
export const updateStandardMapping = (id, mapping) => axios.put(`${PUT_STANDARD_MAPPING}/${id}`, mapping)

// Delete mapping by id
export const deleteMappingById = (mappingId) => axios.delete(`${DELETE_MAPPING}`, {
  params: {
    mappingId
  }
})

// Upload file for matrix analysis
export const uploadFile = (data) => axios.post(`${UPLOAD_FILE}`, ((file) => {
  var formData = new FormData()
  formData.append('file', file)
  return formData
})(data))

// Save matrix analysis
export const saveNonStandardMatrixAnalysis = (matrix) => axios.post(`${SAVE_MATRIX_ANALYSIS}`, matrix)

// Save standard matrix analysis
export const saveStandardMatrixAnalysis = (matrix) => axios.put(`${STANDARD_MATRIX_ANALYSIS}`, matrix)
