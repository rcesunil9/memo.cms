import * as React from 'react'
import split from "lodash/split"
import last from "lodash/last"
import "../../../../assets/flags/flags.min.css"

const FlagIcon = ({code, ...otherProps}) => (
    <img 
        src="blank.gif" 
        className={`flag flag-${last(split(code.toLowerCase(), "-"))}`} 
        alt="" 
        {...otherProps}
        />
)

export default FlagIcon
