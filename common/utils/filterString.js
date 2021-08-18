import includes from "lodash/includes"
import toString from 'lodash/toString'

export const filterStringValueLowerCase = (filter, row) => {
  const id = filter.pivotId || filter.id
  const val1 = toString(row[id]).toLowerCase()
  const val2 = toString(filter.value).toLowerCase()
  return row[id] === undefined ? true : (val1 === val2 || includes(val1, val2))
}