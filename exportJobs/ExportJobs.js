import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from "lodash/get"
import dotProp from "dot-prop-immutable"
import PageWrapper from "../common/components/layout/PageWrapper"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import Loading from "../common/components/loaders/Loading"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"
import ExportProgressBar from "./ExportProgressBar"

class ExportJobs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      timer: null
    }
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    const { filters, autorefreshTimer } = this.props
    const { applyPreComputingJobsFilters } = this.props
    applyPreComputingJobsFilters(filters)
    this.setState({timer: setInterval(this.refresh, autorefreshTimer)})
  }

  refresh() {
    const { filters, autorefresh } = this.props
    const { applyPreComputingJobsFilters } = this.props
    if(autorefresh) applyPreComputingJobsFilters(filters)
  }

  componentWillUnmount() {
    const { resetPreComputingJobs } = this.props
    clearInterval(this.state.timer);
    resetPreComputingJobs()
  }

  render() {

    const { jobs, filters, autorefresh } = this.props
    const { applyPreComputingJobsFilters, togglePreComputingJobsAutorefresh, retryJob } = this.props

    return (
      <PageWrapper>
        <div className="row">
          <div className="col-12">
            <h3>Pre-computing jobs</h3>
            <br/>
            <div className="form-group">
              <label>Autorefresh?</label>
              <input
                onChange={e => togglePreComputingJobsAutorefresh()}
                checked={autorefresh ? true : false}
                className="form-control"
                type="checkbox" />
            </div>

            {/* Filters */}
            <div className="form-group">
              <label>Only full jobs?</label>
              <input
                onChange={e => applyPreComputingJobsFilters(dotProp.set(filters, "onlyFull", !filters.onlyFull))}
                checked={filters.onlyFull ? true : false}
                className="form-control"
                type="checkbox" />
            </div>

            <SmartDatatable
              data={jobs}
              sortable={false}
              showPaginationTop={true}
              onPageSizeChange={size => applyPreComputingJobsFilters(dotProp.set(filters, "pageSize", size))}
              onPageChange={page => applyPreComputingJobsFilters(dotProp.set(filters, "pageNumber", page))}
              pageSizeOptions={[5, 10, 20, 25, 50, 100, 200]}
              manual
              page={filters.pageNumber}
              pages={10}
              pageSize={filters.pageSize}
              className="-striped -highlight"
              columns={[
                {
                    Header: "ID",
                    accessor: "id",
                    width: 50
                },
                {
                  Header: "Action",
                  width: 200,
                  id: "exportPreComputedTradeItemActionName",
                  accessor: d => <strong>{get(d, "exportPreComputedTradeItemActionName", "")}</strong>
                },
                {
                  Header: "Status",
                  className: "text-center",
                  id: "status",
                  width: 50,
                  accessor: job => {
                    if(utils.isJobSuccess(job)) return <i className="icon-check text-success" />
                    else if(utils.isJobError(job)) return <i className="icon-check text-close" />
                    else if(utils.isJobPending(job)) return <Loading />
                    return job.status
                  }
                },
                {
                    Header: "Total",
                    className: "text-center",
                    width: 100,
                    accessor: "total"
                },
                {
                    Header: "Failed",
                    className: "text-center",
                    width: 100,
                    id: "failed",
                    accessor: d => (get(d, "failed") > 0 && <span className="badge badge-pill badge-danger">{get(d, "failed")}</span>) || 0
                },
                {
                    Header: "Done",
                    className: "text-center",
                    width: 100,
                    id: "done",
                    accessor: d => get(d, "progress", 0)
                },
                {
                  Header: "Progression",
                  id: "progression",
                  width: 150,
                  accessor: job => (
                    <ExportProgressBar job={job} /> 
                  )
                },
                {
                  Header: "Start",
                  className: "text-center",
                  width: 150,
                  id: "startTimestamp",
                  accessor: d => utils.getStartDate(d)
                },
                {
                  Header: "End",
                  className: "text-center",
                  width: 150,
                  id: "endTimestamp",
                  accessor: d => utils.getEndDate(d)
                },
                {
                  Header: "Duration",
                  width: 100,
                  id: "duration",
                  accessor: d => <div className="text-center">{utils.getTotalDuration(d)}</div>
                },
                {
                  Header: "Actions",
                  className: "text-center",
                  id: "actions",
                  accessor: job => <div>
                    <button onClick={e => retryJob(job.id)} className="btn btn-sm btn-light">
                      <i className="icon-reload"/> Retry</button>
                    <Link to={`/pre-computed-trade-items/${job.exportPreComputedTradeItemActionId}`} className="btn btn-sm btn-light ml-2">
                      <i className="icon-list"/> View products</Link>
                    <Link to={`/pre-computing-job-detail/${job.id}/${job.exportPreComputedTradeItemActionId}`} className="btn btn-sm btn-light ml-2">
                      Detail</Link>
                  </div>
                }
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
      jobs: selectors.getJobs(state),
      filters: selectors.getJobsFilters(state),
      autorefresh: selectors.getJobsAutorefresh(state),
      jobDetails: selectors.getJobDetail(state),
      autorefreshTimer: 2500,
    }
}

export default withRouter(connect(mapStateToProps, actions)(ExportJobs))
