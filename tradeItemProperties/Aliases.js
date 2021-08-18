import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import map from "lodash/map"
import get from "lodash/get"
import size from "lodash/size"
import * as actions from "./actions"
import * as selectors from "./selectors"
import PageWrapper from "../common/components/layout/PageWrapper"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../common/utils/filterString'


class Aliases extends React.Component {

    componentDidMount() {
        const { getAliases } = this.props
        getAliases()
    }

    render() {

      const { aliases } = this.props
  
      return (
        <PageWrapper>
          <div className="row mb-3">
            <div className="col">
              <Link to={`/trade-items-properties-alias`} className="btn btn-success">+ Create new alias</Link>
            </div>
          </div>
              <SmartDatatable
                data={aliases}
                sortable={false}
                filterable={true}
                defaultFilterMethod={filterStringValueLowerCase}
                showPagination={false}
                pageSize={size(aliases)}
                className="-striped -highlight"
                columns={[
                  {
                      Header: "Id",
                      accessor: "id"
                  },
                  {
                      Header: "Name",
                      accessor: "aliasName"
                  },
                  {
                      Header: "Properties",
                      id: "tradeItemProperties",
                      accessor: alias => map(get(alias, "tradeItemProperties", []), tip => `${get(tip, "tradeItemPropertyCode")} (${get(tip, "tradeItemPropertyGroup")})`).join(",")
                  },
                  {
                    Header: "Actions",
                    id: "actions",
                    filterable: false,
                    accessor: d => (
                      <div className="text-center">
                        <Link to={ `/trade-items-properties-alias/${d.id}` }>Edit</Link>
                      </div>
                    )
                  }
                ]} />
        </PageWrapper>
      )
    }

}

const mapStateToProps = state => {
  return {
    aliases: selectors.getAliases(state),
  }
}

export default withRouter(connect(mapStateToProps, actions)(Aliases))