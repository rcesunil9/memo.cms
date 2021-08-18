import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { filterStringValueLowerCase } from '../common/utils/filterString'

const Actions = ({ id }) => {
  return (
    <div className="text-center">
      <Link to={`/tools/export-format/${id}`}>Edit</Link>
    </div>
  )
}

const columns = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: "name" },
  { Header: "Discriminator", accessor: "discriminator" },
  {
    Header: "Actions",
    id: "actions",
    filterable: false,
    accessor: Actions
  }
]

class ExportFormatsList extends React.Component {
  componentDidMount() {
    const { loadFormats } = this.props
    loadFormats()
  }

  componentWillUnmount() {
    const { resetFormats } = this.props
    resetFormats()
  }

  render() {
    const { formats } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/tools/export-format`} className="btn btn-success">
              + Create new format
            </Link>
          </div>
        </div>
        <SmartDatatable
          showPaginationTop={true}
          filterable
          defaultFilterMethod={filterStringValueLowerCase}
          data={formats}
          columns={columns}
          defaultSorted={[{ id: "name", desc: false }]}
        />
      </PageWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    formats: selectors.getFormatsList(state)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(ExportFormatsList)
)
