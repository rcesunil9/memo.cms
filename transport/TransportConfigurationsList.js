import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as selectors from "./selectors"
import * as actions from "./actions"

class TransportConfigurationsList extends React.Component {

  componentDidMount() {

    const { getTransportManagementList } = this.props
    getTransportManagementList()

  }

  render() {

    const { filters, results, loading, total } = this.props

    const { updateTransportManagementListFilterValue, deleteTransportConfiguration } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link 
              to={`/transport-configuration`}
              className="btn btn-success">+ Create new transport configuration</Link>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <SmartDatatable
              manual
              style={{zIndex: 0}}
              data={results}
              loading={loading}
              sortable={true}
              showPaginationTop={true}
              onPageSizeChange={size => updateTransportManagementListFilterValue("pageSize", size)}
              onPageChange={page => updateTransportManagementListFilterValue("pageNumber", page)}
              pageSizeOptions={[50, 100, 200, 500, 1000]}
              page={filters.pageNumber}
              pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
              pageSize={filters.pageSize}
              className="-striped -highlight text-center"
              columns={[
                { Header: "ID", accessor: "id", width: 50},
                { Header: "Name", accessor: "name"},
                { Header: "Discriminator", accessor: "discriminator"},
                { Header: "Actions", id: "actions", accessor: transportConfiguration => <div className="text-center">
                    <Link to={`/transport-configuration/${transportConfiguration.id}`}>Edit</Link>
                    <button 
                      onClick={e => {
                        if(window.confirm("Are you sure to delete this configuration??")) {
                          deleteTransportConfiguration(transportConfiguration.id)
                        }
                      }}
                      className="btn btn-link text-danger p-0 ml-2">Delete</button>
                  </div>
                },
              ]}
            />
          </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      filters: selectors.getTransportConfigurationListFilters(state),
      results: selectors.getTransportConfigurationList(state),
      loading: selectors.isTransportConfigurationListFetching(state),
      total: selectors.getTransportConfigurationListTotal(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TransportConfigurationsList))
