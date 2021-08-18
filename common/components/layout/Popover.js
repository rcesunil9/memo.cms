import React from "react"
import { Tooltip } from "react-tippy"

const Popover = props => {
  return <Tooltip
    duration={100}
    arrow={true}
    interactive
    useContext
    animateFill={false}
    {...props} />
}

export default Popover
