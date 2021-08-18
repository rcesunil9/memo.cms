import React from "react"
import Select from "react-select"
import get from 'lodash/get'
import find from 'lodash/find'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import dotProp from 'dot-prop-immutable'
import * as actions from '../actions'


class UpdateIcecatTaxonomyActionViewModel extends React.Component {

  componentDidMount() {
    this.init()
  }

  async init() {
    const { model } = this.props
    const { setAction } = this.props
    
  }

  render() {

    return (
      <React.Fragment>

        
      </React.Fragment>
    )

  }

}




const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, actions)(UpdateIcecatTaxonomyActionViewModel)
