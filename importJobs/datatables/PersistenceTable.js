import React from "react"
import update from 'immutability-helper'
import SmartDatatable from '../../common/components/datatable/SmartDatatable'
import get from 'lodash/get'
import * as actions from '../actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as selectors from '../selectors'

const PersistenceTable = (props) => {

  const {persistence, persistencePageFilter, persistenceTotal} = props
  const {setDetailReport, setPersistencePageFilter } = props

  return <SmartDatatable
    manual
    data={persistence}
    showPaginationTop={true}
    onPageSizeChange={size => setPersistencePageFilter(update(persistencePageFilter, {pageSize: {$set: size}}))}
    onPageChange={page => setPersistencePageFilter(update(persistencePageFilter, {pageNumber: {$set: page}}))}
    pageSizeOptions={[30, 50, 100]}
    page={get(persistencePageFilter, 'pageNumber')}
    pages={persistenceTotal > 0 ? Math.ceil(persistenceTotal / get(persistencePageFilter, 'pageSize')) : 0}
    pageSize={get(persistencePageFilter, 'pageSize')}
    columns={[
      { Header: "Id", accessor: "contextId" },
      { Header: "Trade item Id", accessor: "tradeItemId" },
      { Header: "User Id", accessor: "userId" },
      { Header: "Reason", accessor: "reason" },
      {
        Header: "Actions",
        id: "actions",
        accessor: d => (
          <div className="text-center">
            <button className="btn btn-secondary" onClick={() => setDetailReport({group: 'persistence', detail: d})}>View detail</button>
          </div>
        )
      }
    ]}
  />
}

const mapStateToProps = state => {
  return {
    persistence: selectors.getPagedPersistence(state),
    persistenceTotal: selectors.getPersistenceTotal(state),
    persistencePageFilter: selectors.getPersistencePageFilter(state),
  };
};

export default withRouter(connect(mapStateToProps, actions)(PersistenceTable));