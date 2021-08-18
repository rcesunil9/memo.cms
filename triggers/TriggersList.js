import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import get from 'lodash/get'
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { filterStringValueLowerCase } from '../common/utils/filterString'

const Actions = ({ item, launchTrigger}) => {
  return (
    <div className="text-center">
      <Link to={`/trigger/${item.id}`} className="mr-3">Edit</Link>
      {get(item,'discriminator') === 'PeriodicTriggerViewModel' && <button
        onClick={e => {
          e.preventDefault()
          window.confirm(`Are you sure?`) && launchTrigger(item.id)
        }}
        className="btn btn-secondary"><i className="icon-energy" /> Launch trigger</button>}
    </div>
  )
}

class TriggersList extends React.Component {
  componentDidMount() {
    const { loadTriggers } = this.props
    loadTriggers()
  }

  componentWillUnmount() {
    const { resetTriggers } = this.props
    resetTriggers()
  }

  render() {
    const { triggers, launchTrigger } = this.props
    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/trigger`} className="btn btn-success">
              + Create new trigger
            </Link>
          </div>
        </div>
        <SmartDatatable
          showPaginationTop={true}
          filterable
          defaultFilterMethod={filterStringValueLowerCase}
          data={triggers}
          columns={[
            { Header: "ID", accessor: "id" },
            { Header: "Name", accessor: "name" },
            { Header: "Type", accessor: "discriminator" },
            {
              Header: "Actions",
              id: "actions",
              filterable: false,
              accessor: item => <Actions item={item} launchTrigger={launchTrigger}/>
            }
          ]}
          defaultSorted={[{ id: "name", desc: false }]}
        />
      </PageWrapper>
    )
  }
}

const props = state => ({
  triggers: selectors.getTriggersList(state)
})

export default connect(
  props,
  actions
)(TriggersList)
