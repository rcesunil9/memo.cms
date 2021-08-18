import React from "react"
import { components } from "react-select"
import Select from "react-select"
import size from "lodash/size"
import { onlyUpdateForKeys } from 'recompose'

const ControlComponent = onlyUpdateForKeys([
  "value"
])(
  props => (
    <components.Control {...props} />
  )
)

class OptimizedSelect extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    if(size(nextProps.options) !== size(this.props.options)) return true
    if(size(nextProps.value) !== size(this.props.value)) return true
    return false
  }

  render() {
    return (
      <Select {...this.props} components={{...this.props.components, ControlComponent }} />
    )
  }

}

export default OptimizedSelect