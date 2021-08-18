import axios from "axios"
import * as env from "../../environment/index.js"

// Set the services URIs
const REJECTIONS_URI = `${env.CDM_FORMAT_PROCESSING_SERVICE_URI}/api/ValidationError`
const PROCESS_URI = `${env.CDM_FORMAT_PROCESSING_SERVICE_URI}/api/Process`
const VALIDATE_JSON_URI = `${PROCESS_URI}/ValidateJsonTemplate`

// validate a JSON template for a given trade item and action
//
export const validateJSONTemplate = (formatConfigurationId, tradeItemId, actionId) => axios.get(`${VALIDATE_JSON_URI}`, {
    params: {
        formatConfigurationId,
        tradeItemId,
        actionId,
    }
})

export const getFormatProcessingRejections = (pageNumber, pageSize, filters) => axios.get(`${REJECTIONS_URI}/GetPaged`, {
    params: {
        pageNumber,
        pageSize,
        ...filters
    }
})

export const getFormatProcessingRejection = id => axios.get(`${REJECTIONS_URI}/${id}`)
