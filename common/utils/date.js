import moment from "moment"
import momentDurationFormatSetup from "moment-duration-format"

momentDurationFormatSetup(moment);

export const date = (...params) => moment(...params)

export const duration = moment.duration