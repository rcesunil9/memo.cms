import axios from 'axios'
import * as env from '../../environment/index.js'


//////////////////////////////////////////////////////////////////////
//                           ACTION                                 //
//////////////////////////////////////////////////////////////////////
const ACTION_DEFINITIONS_BASE_URI = `${env.CDM_TRANSFORMATION_MANAGEMENT_SERVICE_URI}/api/ActionDefinition`

export const getActionDefinitions = () => axios.get(`${ACTION_DEFINITIONS_BASE_URI}`)
export const getActionDefinition = (id) => axios.get(`${ACTION_DEFINITIONS_BASE_URI}/${id}`)
export const createActionDefinition = (actionDefinition) => axios.post(`${ACTION_DEFINITIONS_BASE_URI}`, actionDefinition)
export const updateActionDefinition = (id, actionDefinition) => axios.put(`${ACTION_DEFINITIONS_BASE_URI}/${id}`, actionDefinition)
export const deleteActionDefinition = (id) => axios.delete(`${ACTION_DEFINITIONS_BASE_URI}/${id}`)

//////////////////////////////////////////////////////////////////////
//                           TRANSFORMATION SETS                    //
//////////////////////////////////////////////////////////////////////
const TRANS_SET_BASE_URI = `${env.CDM_TRANSFORMATION_MANAGEMENT_SERVICE_URI}/api/TransformationSet`
const TRANS_SET_GET_ALL_LIGHT_URI = `${TRANS_SET_BASE_URI}/GetAllLight`
// const TRANS_SET_GET_PAGED_URI = `${TRANS_SET_BASE_URI}/GetPaged`
const TRANS_SET_GET_PAGED_LIGHT_URI = `${TRANS_SET_BASE_URI}/GetPagedLight`
const TRANS_SET_GET_LIGHT_URI = `${TRANS_SET_BASE_URI}/GetLight`
const TRANS_SET_GET_TRANSFORMATIONS_NAMES_BY_ID = `${TRANS_SET_BASE_URI}/GetTransformationNameByTransformationSetId`

// export const getTransformationSets = () => axios.get(`${TRANS_SET_BASE_URI}`)
// export const getTransformationSetsPaged = (filters) => axios.get(`${TRANS_SET_GET_PAGED_URI}`, {
//     params: filters
// })
export const getTransformationSetsByTradeItemCategoryCode = (taxonomyId, tradeItemCategoryCode) => axios.get(`${TRANS_SET_GET_LIGHT_URI}/${tradeItemCategoryCode}/${taxonomyId}`)
export const getTransformationSets = () => axios.get(`${TRANS_SET_GET_ALL_LIGHT_URI}`)
export const getTransformationSetsPaged = (filters) => axios.get(`${TRANS_SET_GET_PAGED_LIGHT_URI}`, {
    params: filters
})
export const getTransformationSet = (id) => axios.get(`${TRANS_SET_BASE_URI}/${id}`)
export const createTransformationSet = (transformationSet) => axios.post(`${TRANS_SET_BASE_URI}`, transformationSet)
export const updateTransformationSet = (id, transformationSet) => axios.put(`${TRANS_SET_BASE_URI}/${id}`, transformationSet)
export const deleteTransformationSet = (id) => axios.delete(`${TRANS_SET_BASE_URI}/${id}`)
export const getTransformationNameByTransformationSetId = (transformationSetId) => axios.get(`${TRANS_SET_GET_TRANSFORMATIONS_NAMES_BY_ID}`, {
    params: {transformationSetId}
})