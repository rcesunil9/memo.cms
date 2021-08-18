import React from "react"
import DatePicker from "../date/DatePicker"
import {date} from "../../utils/date"


const DateParam = ({
  value,
  // functions 
  onChange
}) => (
  <React.Fragment>
    <DatePicker
      onChange={d => onChange(d && d.format('YYYY-MM-DD'))}
      value={date(value)} />
  </React.Fragment>
)

export default DateParam
