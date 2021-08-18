import React from "react"
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import update from 'immutability-helper'
import get from 'lodash/get'
import * as actions from '../actions'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import * as selectors from '../selectors'

const BusinessRulesTable = (props) => {

  const { businessRule, businessRulePageFilter, businessRuleTotal } = props
  const { setDetailReport, setBusinessRulePageFilter } = props

  return <SmartDatatable
    manual
    data={businessRule}
    showPaginationTop={true}
    onPageSizeChange={size => setBusinessRulePageFilter(update(businessRulePageFilter, {pageSize: {$set: size}}))}
    onPageChange={page => setBusinessRulePageFilter(update(businessRulePageFilter, {pageNumber: {$set: page}}))}
    pageSizeOptions={[ 30, 50, 100]}
    page={businessRulePageFilter.pageNumber}
    pages={businessRuleTotal > 0 ? Math.ceil(businessRuleTotal / get(businessRulePageFilter, 'pageSize')) : 0}
    pageSize={businessRulePageFilter.pageSize}
    columns={[
      {
        Header: "Trade item",
        id: "tradeItemId",
        accessor: rule => <Link to={`/trade-item/${get(rule, 'tradeItemId')}`}>{get(rule, 'tradeItemId')}</Link>
      },
      { Header: "Name", accessor: "name" },
      {
        Header: "Status",
        id: "success",
        className: "text-center",
        accessor: rule => rule.success ? <i className="icon-check text-success" /> : <i className="icon-close text-danger" />
      },
      {
        Header: "Actions",
        id: "actions",
        accessor: d => (
          <div className="text-center">
            <button className="btn btn-secondary" onClick={() => setDetailReport({group: 'businessRule', detail: d})}>View detail</button>
          </div>
        )
      }
    ]}
  />
}

const mapStateToProps = state => {
  return {
    businessRule: selectors.getPagedBusinessRule(state),
    businessRuleTotal: selectors.getBusinessRuleTotal(state),
    businessRulePageFilter: selectors.getBusinessRuleTotalPageFilter(state),
  };
};

export default withRouter(connect(mapStateToProps, actions)(BusinessRulesTable));