import React from 'react'
import { connect } from "react-redux"
import * as actions from './actions'
import * as selectors from "./selectors"
import createMappingToState from "../common/selectors/createMappingToState"

const mapStateToProps = createMappingToState(selectors)

export default function withTradeItemCategoriesAndGroupsAndTaxonomies(WrappedComponent) {
  return connect(mapStateToProps, actions)(
    class extends React.Component {

      componentDidMount() {
        const { getTradeItemCategories, getGroups, getTaxonomies } = this.props
        getTradeItemCategories()
        getGroups()
        getTaxonomies()
      }

      render() {
        return <WrappedComponent {...this.props} />
      }
  })
}
