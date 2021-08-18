import get from "lodash/get"
import { date, duration } from "../common/utils/date"

export const getReportGroups = () => ['Mapping', "Business Rules", "Persistence"]

export const initNewListingItem = () => {
  return {
    fileColumnIdentifier: null,
    fileColumnName: null,
  }
}

export const getDefaultMappingFilters = () => {
  return {
    gtin: null,
    tradeItemManufacturerCode: null,
    pageNumber: 0,
    pageSize: 30,
  }
}

export const getDefaultPageFilter = () => {
  return {
    pageNumber: 0,
    pageSize: 30,
  }
}

export const getTotalProgressionPercentage = importJob => {
  return Math.round(((importJob.countTradeItemImported + importJob.countTradeItemNotChanged + importJob.countTradeItemImportFailed + importJob.countTradeItemRejected) / importJob.countTradeItemToImport) * 100)
}

export const getSuccessProgressionPercentage = importJob => {
  return Math.round(((importJob.countTradeItemImported + importJob.countTradeItemNotChanged) / importJob.countTradeItemToImport) * 100)
}

export const getFailedProgressionPercentage = importJob => {
  return Math.round(((importJob.countTradeItemImportFailed + importJob.countTradeItemRejected) / importJob.countTradeItemToImport) * 100)
}

export const isImportDone = importJob => {
  return importJob.countTradeItemImported + importJob.countTradeItemNotChanged + importJob.countTradeItemImportFailed + importJob.countTradeItemRejected === importJob.countTradeItemToImport
}

export const isImportJobError = importJob => {
  return importJob.countTradeItemImportFailed + importJob.countTradeItemRejected > 0
}

export const isImportSuccess = importJob => {
  return (importJob.countTradeItemImported + importJob.countTradeItemNotChanged) === importJob.countTradeItemToImport
}

export const getTotalDuration = importJob => {
  return get(importJob, "endTimestamp", null) && get(importJob, "startTimestamp", null) 
    ? duration((date(get(importJob, "endTimestamp")).format("x") - date(get(importJob, "startTimestamp")).format("x"))).format("h [hrs], m [min], ss [s]")
    : ""
}

export const getStartDate = importJob => {
  return get(importJob, "startTimestamp", null) ? date(get(importJob, "startTimestamp")).calendar() : ""
}

export const getEndDate = importJob => {
  return get(importJob, "endTimestamp", null) ? date(get(importJob, "endTimestamp")).calendar() : ""
}

export const getCreationDateTime = item => {
  return get(item, "creationTimestamp") ? date(get(item, "creationTimestamp")).format('YYYY-MM-DD HH:mm') : ""
}