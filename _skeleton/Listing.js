import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import PageWrapper from "../common/components/layout/PageWrapper"
import * as selectors from "./selectors"
import * as actions from "./actions"

class Listing extends React.Component {

  componentDidMount() {
    const { getListing } = this.props
    getListing()
  }

  render() {

    const { listing } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            {/* render listing */}
          </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      listing: selectors.getList(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(Listing))
