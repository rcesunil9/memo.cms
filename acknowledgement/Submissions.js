import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from 'lodash/get'
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"

class Submissions extends React.Component {

  componentDidMount() {
    const { filters } = this.props
    const { getSubmissions } = this.props
    getSubmissions(filters)
  }

  render() {

    const { submissions, areSubmissionsFetching, filters, total } = this.props

    const { updateSubmissionsFiltersKey} = this.props

    return (
      <PageWrapper>
        <SmartDatatable
          manual
          style={{zIndex: 0}}
          data={submissions}
          loading={areSubmissionsFetching}
          sortable={true}
          showPaginationTop={true}
          onPageSizeChange={size => updateSubmissionsFiltersKey("pageSize", size)}
          onPageChange={page => updateSubmissionsFiltersKey("pageNumber", page)}
          pageSizeOptions={[50, 100, 200, 500, 1000]}
          page={filters.pageNumber}
          pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
          pageSize={filters.pageSize}
          className="-striped -highlight text-center"
          columns={[
            { Header: "ID", accessor: "id", width: 50},
            { Header: "Action name", id: "actionName", className: "text-left", accessor: submission => <Link taget="blank" to={`/action/${submission.actionId}`} >{submission.actionName}</Link> },
            { Header: "Connector", accessor: "connectorName" },
            { Header: "Acknowledge expected", id: "acknowledgeExpected", accessor: submission => submission.acknowledgeExpected ? <i className="text-success icon-check" /> : <i className="text-danger icon-close" /> },
            { Header: "Acknowledge Received", id: "acknowledgeReceived", accessor: submission => submission.acknowledgeReceived ? <i className="text-success icon-check" /> : <i className="text-danger icon-close" /> },
            { Header: "Status", id: "status", accessor: submission => (
              <span className={get(submission, 'failed') === true ? 'text-danger' : 'text-success'}>{get(submission, 'failed') === true ? 'Failed' : 'Success'}</span>
            )},
            { Header: "Timeout", accessor: "acknowledgeTimeout" },
            { Header: "Date", id: "creationTimestamp", accessor: submission => utils.getCreationDateTime(submission) },
            { Header: "View detail", id: "detail", accessor: submission => <Link target="blank" to={`/acknowledgement/submission/${submission.id}`}>Detail</Link> },
          ]}
        />
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submissions: selectors.getSubmissions(state),
    areSubmissionsFetching: selectors.areSubmissionsFetching(state),
    total: selectors.getTotalSubmissions(state),
    filters: selectors.getSubmissionsFilters(state),
  }
}

export default withRouter(connect(mapStateToProps, actions)(Submissions))
