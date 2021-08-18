import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import size from "lodash/size"
import * as selectors from "./selectors"
import * as actions from "./actions"
import PageWrapper from "../common/components/layout/PageWrapper"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../common/utils/filterString'


class ManufacturersList extends React.Component {

  componentDidMount() {
    const { getManufacturers } = this.props
    getManufacturers()
  }

  render() {
    const { manufacturers } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/manufacturer`} className="btn btn-success">+ Create new manufacturer</Link>
          </div>
        </div>
            <SmartDatatable
              data={manufacturers}
              sortable={false}
              filterable={true}
              defaultFilterMethod={filterStringValueLowerCase}
              showPagination={false}
              pageSize={size(manufacturers)}
              className="-striped -highlight"
              columns={[
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
                      <Link to={ `/manufacturer/${d.id}` }>Edit</Link>
                    </div>
                  )
                }
              ]} />
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      manufacturers: selectors.getManufacturersOrderByName(state)
    }
}

export default withRouter(connect(mapStateToProps, actions)(ManufacturersList))
