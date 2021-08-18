import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"

class Conflicts extends React.Component {

  componentDidMount() {
    const { filters } = this.props
    const { getConflicts } = this.props
    getConflicts(filters)
  }

  render() {

    const { conflicts, areConflictsFetching, filters, total } = this.props

    const { updateConflictsFiltersKey, keepOurs, keepTheirs } = this.props

    return (
      <PageWrapper>
        <SmartDatatable
          manual
          style={{zIndex: 0}}
          data={conflicts}
          loading={areConflictsFetching}
          sortable={true}
          showPaginationTop={true}
          onPageSizeChange={size => updateConflictsFiltersKey("pageSize", size)}
          onPageChange={page => updateConflictsFiltersKey("pageNumber", page)}
          pageSizeOptions={[50, 100, 200, 500, 1000]}
          page={filters.pageNumber}
          pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
          pageSize={filters.pageSize}
          className="-striped -highlight text-center"
          columns={[
            { Header: "ID", accessor: "id", width: 50},
            { Header: "Trade item ID", id: "tradeItemId", accessor: conflict => <Link taget="blank" to={`/trade-item/${conflict.tradeItemId}`} >View trade item</Link> },
            { Header: "Resolved", id: "isResolved", accessor: conflict => conflict.isResolved ? <i className="text-success icon-check" /> : <i className="text-danger icon-close" /> },
            { Header: "Retailer", id: "retailerId", accessor: conflict => <div>Amazon</div> },
            { Header: "Retailer code", accessor: "retailerCode" },
            { Header: "Description", accessor: "description" },
            { Header: "Property name", accessor: "propertyName" },
            { Header: "Severity", accessor: "severity" },
            { Header: "Date", id: "creationTimestamp", accessor: conflict => utils.getCreationDate(conflict) },
            { Header: "Actions", id: "actions", accessor: conflict => !conflict.isResolved && conflict.retailerCode ? (
              <div>
                <button className="btn btn-sm btn-primary mr-2" onClick={e => keepOurs(conflict.id)}>Ours</button>
                <button className="btn btn-sm btn-primary" onClick={e => keepTheirs(conflict.id)}>Theirs</button>
              </div>
            ) : <div></div>
            },
          ]}
        />
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      conflicts: selectors.getConflicts(state),
      areConflictsFetching: selectors.areConflictsFetching(state),
      total: selectors.getTotalConflicts(state),
      filters: selectors.getConflictsFilters(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(Conflicts))
