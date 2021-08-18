import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { filterStringValueLowerCase } from '../common/utils/filterString'


class ActionsList extends React.Component {
  componentDidMount() {
    const { loadActions } = this.props
    loadActions()
  }

  componentWillUnmount() {
    const { resetActions } = this.props
    resetActions()
  }

  delete = async action => {
    const { deleteAction, loadActions } = this.props
    if (!window.confirm(`Are you sure to delete ${action.name}?`)) return
    await deleteAction(action.id)
    loadActions()
  }

  render() {
    const { actions } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/action`} className="btn btn-success">
              + Create new action
            </Link>
          </div>
        </div>
        <SmartDatatable
          showPaginationTop={true}
          filterable
          defaultFilterMethod={filterStringValueLowerCase}
          data={actions}
          columns={[
            { Header: "ID", accessor: "id" },
            { Header: "Name", accessor: "name" },
            { Header: "Type", accessor: "discriminator" },
            {
              Header: "Actions",
              id: "actions",
              filterable: false,
              accessor: a => (
                <div className="text-center">
                  <Link to={`/action/${a.id}`}>Edit</Link>
                  {a.discriminator === 'ExportPreComputedTradeItemActionViewModel' && <Link className="ml-2" to={`/action-precomputing-detail/${a.id}`}>Detail</Link>}
                  <button className="btn btn-link p-0 text-danger ml-2" onClick={e => this.delete(a)}>Delete</button>
                </div>
              )
            }
          ]}
          defaultSorted={[{ id: "name", desc: false }]}
        />
      </PageWrapper>
    )
  }
}

const props = state => ({
  actions: selectors.getActionsList(state)
})

export default connect(
  props,
  actions
)(ActionsList)
