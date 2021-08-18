import get from "lodash/get"
import { date } from "../common/utils/date"

export const getConflictsDefaultFilters = () => {
  return {
    pageNumber: 0,
    pageSize: 100,
  }
}

export const getSubmissionsDefaultFilters = () => {
  return {
    pageNumber: 0,
    pageSize: 100,
  }
}

export const getCreationDate = item => {
  return get(item, "creationTimestamp", null) ? date(get(item, "creationTimestamp")).calendar() : ""
}

export const getCreationDateTime = item => {
  return get(item, "creationTimestamp") ? date(get(item, "creationTimestamp")).format('YYYY-MM-DD HH:mm') : ""
}