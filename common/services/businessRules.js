import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const BUSINESS_RULES_BASE_URI = `${env.CDM_BUSINESS_RULES_MGMNT}/api/businessrulemanagement`
const GET_BUSINESS_RULES = `${BUSINESS_RULES_BASE_URI}`
const GET_BUSINESS_RULES_VALIDATORS = `${BUSINESS_RULES_BASE_URI}/getBusinessRuleTypes`

// Get all business rules
export const getBusinessRules = value => axios.get(`${GET_BUSINESS_RULES}`)

// Get all business rules validators
export const getBusinessRulesValidators = value => axios.get(`${GET_BUSINESS_RULES_VALIDATORS}`)

// Create business rule
export const createBusinessRule = (businessRule) => axios.post(`${BUSINESS_RULES_BASE_URI}`, businessRule)

// Update business rule
export const updateBusinessRule = (id, businessRule) => axios.put(`${BUSINESS_RULES_BASE_URI}/${id}`, businessRule)

// Delete business rule
export const deleteBusinessRule = (id) => axios.delete(`${BUSINESS_RULES_BASE_URI}/${id}`)

// Get business rule by id
export const getBusinessRuleById = id => axios.get(`${BUSINESS_RULES_BASE_URI}/${id}`)

//////////////////////////////////////////////////////////////////////
//                           RULES SETS                             //
//////////////////////////////////////////////////////////////////////
const BUSINESS_RULES_SET_BASE_URI = `${env.CDM_BUSINESS_RULES_MGMNT}/api/BusinessRuleSetManagement`
const BUSINESS_RULES_SET_GET_BY_SCOPE_GROUP_URI = `${BUSINESS_RULES_SET_BASE_URI}/GetByTradeItemCategoryAndGroup`
const BUSINESS_RULES_SET_GET_BY_TAXONOMY_AND_TRADE_ITEM_CATEGORY_CODE_URI = `${BUSINESS_RULES_SET_BASE_URI}/GetByTaxonomyIdAndTradeItemCategoryCode`

// Get all business rules
export const getBusinessRulesSets = value => axios.get(`${BUSINESS_RULES_SET_BASE_URI}`)

// Get all business rules sets by scope & group
export const getByTaxonomyIdAndTradeItemCategoryCode = (taxonomyId, tradeItemCategoryCode) => axios.get(`${BUSINESS_RULES_SET_GET_BY_TAXONOMY_AND_TRADE_ITEM_CATEGORY_CODE_URI}`, {
  params: {
      taxonomyId,
      tradeItemCategoryCode
  }
})

// Get all business rules sets by scope & group
export const getBusinessRulesSetsByTradeItemCategoryAndGroup = (taxonomyId, propertyGroupId, tradeItemCategoryCode) => axios.get(`${BUSINESS_RULES_SET_GET_BY_SCOPE_GROUP_URI}`, {
    params: {
        taxonomyId,
        propertyGroupId,
        tradeItemCategoryCode
    }
})

// Get business rule set by id
export const getBusinessRuleSetById = id => axios.get(`${BUSINESS_RULES_SET_BASE_URI}/${id}`)

// Create business rule
export const createBusinessRuleSet = (businessRuleSet) => axios.post(`${BUSINESS_RULES_SET_BASE_URI}`, businessRuleSet)

// Update business rule
export const updateBusinessRuleSet = (id, businessRuleSet) => axios.put(`${BUSINESS_RULES_SET_BASE_URI}/${id}`, businessRuleSet)

// Delete business rule set
export const deleteBusinessRuleSet = (id) => axios.delete(`${BUSINESS_RULES_SET_BASE_URI}/${id}`)

//////////////////////////////////////////////////////////////////////
//                           EVALUATION                             //
//////////////////////////////////////////////////////////////////////
const BUSINESS_RULES_EVAL_BASE_URI = `${env.CDM_BUSINESS_RULES_EVAL}/api/BusinessRuleEvaluation`
const GET_EVALUATION_WITH_CONTEXT = `${BUSINESS_RULES_EVAL_BASE_URI}/GetEvaluationWithContext`
const GET_PAGED_EVALUATION = `${BUSINESS_RULES_EVAL_BASE_URI}/GetPaged`
const GET_BY_TRADE_ITEM_EVALUATION = `${BUSINESS_RULES_EVAL_BASE_URI}/GetByTradeItem`

// Get evaluation detail
export const getEvaluationDetails = (contextId) => axios.get(`${GET_EVALUATION_WITH_CONTEXT}`, {
    params: {
        contextId
    }
})

export const getPagedBusinessRuleResult = (contextId, pageNumber, pageSize) => axios.get(`${GET_PAGED_EVALUATION}`, {
  params: {
    contextId,
    pageNumber,
    pageSize
  }
})

export const getEvaluationByTradeItem = (contextId, tradeItemId) => axios.get(`${GET_BY_TRADE_ITEM_EVALUATION}`, {
  params: {
    contextId,
    tradeItemId
  }
})