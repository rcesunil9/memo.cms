import axios from 'axios'
import * as env from '../../environment/index.js'

// Set the services URIs
const IMPORT_SERVICE_BASE_URI = `${env.CDM_IMPORT_SERVICE_URI}/api/ImportJob`

// Get all paged import jobs
export const getImportJobs = (pageNumber, pageSize): Promise<*> => axios.get(`${IMPORT_SERVICE_BASE_URI}`, {
  params: {
    pageNumber,
    pageSize
  }
})

// Get one import job
export const getImportJob = (importJobId): Promise<*> => axios.get(`${IMPORT_SERVICE_BASE_URI}/${importJobId}`)
