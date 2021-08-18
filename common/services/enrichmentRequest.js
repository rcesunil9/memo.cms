import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const BASE_URL = `${env.CDM_ENRICHMENT_REQUEST_SERVICE_URI}/api/cms`

const getPagedEnrichmentRequests = (pageNumber, pageSize, filters) => axios.post(`${BASE_URL}/paged`, filters, {
    params: {
        pageNumber,
        pageSize
    }
})

const getPagedEnrichmentRequestDetail = (enrichmentRequestId, pageNumber, pageSize, filters) => axios.post(`${BASE_URL}/detail/paged`, filters, {
    params: {
        enrichmentRequestId,
        pageNumber,
        pageSize
    }
})

export { getPagedEnrichmentRequests, getPagedEnrichmentRequestDetail }