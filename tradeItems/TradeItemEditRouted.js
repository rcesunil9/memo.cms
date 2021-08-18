import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import get from "lodash/get"
import * as actions from "./actions"
import PageWrapper from "../common/components/layout/PageWrapper"
import TradeItemEdit from "./TradeItemEdit"

const TradeItemEditRouted = ({match}) => (
  <PageWrapper>
    <TradeItemEdit id={get(match, "params.id", null)} />
  </PageWrapper>
)

const mapStateToProps = (state) => {
    return {}
}

export default withRouter(connect(mapStateToProps, actions)(TradeItemEditRouted))
