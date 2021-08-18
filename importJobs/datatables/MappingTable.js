import React from "react"
import SmartDatatable from '../../common/components/datatable/SmartDatatable'
import * as utils from './../utils'
import update from 'immutability-helper'
import get from 'lodash/get'
import * as actions from '../actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as selectors from '../selectors'

const MappingTable = (props) => {

  const { mapping, mappingFilter, mappingTotal } = props
  const { setDetailReport, setMappingFilter } = props

  return <SmartDatatable
    manual
    data={mapping}
    showPaginationTop={true}
    onPageSizeChange={size => setMappingFilter(update(mappingFilter, {pageSize: {$set: size}}))}
    onPageChange={page => setMappingFilter(update(mappingFilter, {pageNumber: {$set: page}}))}
    pageSizeOptions={[30, 50, 100]}
    page={get(mappingFilter, 'pageNumber', 0)}
    pages={mappingTotal > 0 ? Math.ceil(mappingTotal / get(mappingFilter, 'pageSize')) : 0}
    pageSize={get(mappingFilter, 'pageSize', 10)}
    columns={[
      { Header: "Line number", accessor: "lineNumber" },
      { Header: "Sheet index", accessor: "sheetIndex" },
      { Header: "Reason", accessor: "reason" },
      { Header: "GTIN", accessor: "gtin" },
      { Header: "Manufacturer code", accessor: "tradeItemManufacturerCode" },
      { Header: "Property code", accessor: "propertyCode" },
      { Header: "Property value", accessor: "propertyValue" },
      { Header: "Date", id: "creationTimestamp", accessor: mapping => utils.getCreationDateTime(mapping) },
      {Header: "Actions", id: "actions", accessor: d => (
          <div className="text-center">
            <button className="btn btn-secondary" onClick={() => setDetailReport({group: 'mapping', detail: d})}>View detail</button>
          </div>
        )
      }
    ]}
  />
}

const mapStateToProps = state => {
  return {
    mappingFilter: selectors.getMappingFilters(state),
    mapping: selectors.getPagedMapping(state),
    mappingTotal: selectors.getMappingTotal(state)
  };
};

export default withRouter(connect(mapStateToProps, actions)(MappingTable));