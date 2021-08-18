import React from "react"
import dotProp from "dot-prop-immutable"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import * as selectors from "./selectors/list"
import * as actions from "./actions/list"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"


const Actions = ({id}) => (
    <div className="text-center">
        <Link to={`/tools/export-transformation/${id}`}>Edit</Link>
    </div>
)

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    {
        Header: "Actions",
        id: "actions",
        accessor: Actions
    }
]


class TransformationSetsList extends React.Component {

  componentDidMount() {
    this.init()
  }

  init() {
    const { filters } = this.props
    const { getList } = this.props
    getList(filters)
  }

  render() {
    const { rows, filters, pages } = this.props
    const { getList } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
            <div className="col">
                <Link 
                    to={`/tools/export-transformation`}
                    className="btn btn-success">+ Create new transformation set</Link>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col-12">
                <SmartDatatable
                    manual
                    sortable={false}
                    showPaginationTop={true}
                    onPageSizeChange={size => getList(dotProp.set(filters, "Take", size))}
                    onPageChange={page => getList(dotProp.set(filters, "Skip", page))}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100, 200]}
                    page={filters.Skip}
                    pages={pages}
                    pageSize={filters.Take}
                    className="-striped -highlight"
                    data={rows}
                    columns={columns} />
            </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        filters: selectors.getFilters(state),
        total: selectors.getTotal(state),
        rows: selectors.getRows(state),
        isLoading: selectors.isLoading(state),
        pages: selectors.getTotalPages(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TransformationSetsList))
