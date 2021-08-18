import get from "lodash/get"
import { date, duration } from "../common/utils/date"

export const JOB_CREATED = "CREATED"
export const JOB_PENDING = "PENDING"
export const JOB_DONE = "DONE"
export const JOB_CANCELLED = "CANCELLED"
export const JOB_INVALIDATE = "INVALIDATE"

export const getPreComputingJobsFilters = () => {
  return {
    pageNumber: 0,
    pageSize: 10,
    onlyFull: true,
  }
}

export const getTotalProgressionPercentage = job => {
  return Math.round((job.progress / job.total) * 100)
}

export const getSuccessProgressionPercentage = job => {
  return Math.round(((job.progress - job.failed) / job.total) * 100)
}

export const getFailedProgressionPercentage = job => {
  return  Math.round((job.failed / job.total) * 100)
}

export const isJobDone = job => {
  return job.status === JOB_DONE || job.status === JOB_CANCELLED || job.status === JOB_INVALIDATE
}

export const isJobError = job => {
  return job.status === JOB_CANCELLED || job.status === JOB_INVALIDATE
}

export const isJobSuccess = job => {
  return job.status === JOB_DONE
}

export const isJobPending = job => {
  return job.status === JOB_PENDING
}

export const getTotalDuration = job => {
  return get(job, "updateTimestamp", null) && get(job, "creationTimestamp", null) 
    ? duration((date(get(job, "updateTimestamp")).format("x") - date(get(job, "creationTimestamp")).format("x"))).format("h [hrs], m [min], ss [s]")
    : ""
}

export const getStartDate = job => {
  return get(job, "creationTimestamp", null) ? date(get(job, "creationTimestamp")).calendar() : ""
}

export const getEndDate = job => {
  return isJobDone(job) && get(job, "updateTimestamp", null) ? date(get(job, "updateTimestamp")).calendar() : ""
}