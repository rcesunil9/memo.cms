import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import size from "lodash/size"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { filterStringValueLowerCase } from '../common/utils/filterString'

const TMP_PAGE_SIZE = 200

class RetailersList extends React.Component {
  // fetchData = tableState => {
  //   this.currentTableState = tableState
  //   const { page, pageSize } = tableState
  //   this.props.getRetailers({ Skip: pageSize * page, Take: pageSize })
  // }

  fetchData = () => {
    this.props.getRetailers({ Skip: TMP_PAGE_SIZE * 0, Take: TMP_PAGE_SIZE })
  }

  // hack to load everything until filters are ready on backend size
  componentDidMount() {
    this.fetchData(null)
  }

  async deleteRetailer(id, name) {
    if (!window.confirm(`Are you sure to delete ${name}?`)) return
    await this.props.deleteRetailer(id)
    this.fetchData(this.currentTableState)
  }

  goToEdit(id) {
    this.props.history.push(`/retailer/${id}`)
  }

  render() {
    const { retailers } = this.props


    const columns = [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "External ID",
        accessor: "externalId",
      },
      {
        Header: "Actions",
        id: "actions",
        filterable: false,
        accessor: d => (
          <div className="text-center">
            <button
              className="btn btn-link p-0 mr-2"
              type="button"
              onClick={() => this.goToEdit(d.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-link text-danger p-0"
              type="button"
              onClick={() => this.deleteRetailer(d.id, d.name)}
            >
              Delete
            </button>
          </div>
        )
      }
    ]

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/retailer`} className="btn btn-success">
              + Create new retailer
            </Link>
          </div>
        </div>
        <SmartDatatable
          // manual
          // loading={retailers.isFetching}
          data={retailers}
          // pages={retailers.totalPages}
          // onFetchData={this.fetchData}
          showPagination={false}
          sortable={true}
          filterable={true}
          defaultFilterMethod={filterStringValueLowerCase}
          className="-striped -highlight"
          columns={columns}
          pageSize={size(retailers)}
        />
      </PageWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    retailers: selectors.getRetailersOrderedByName(state)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(RetailersList)
)
