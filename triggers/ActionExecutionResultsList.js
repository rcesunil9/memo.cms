import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Drawer from 'react-motion-drawer'
import get from "lodash/get"
import { date, duration } from "../common/utils/date"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import ActionExecutionResult from "./ActionExecutionResult"
import Loading from "../common/components/loaders/Loading";

class ActionExecutionResultsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      autorefresh: true,
      autorefreshValue: 10000,
    }
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    const { loadActionExecutionResults } = this.props
    loadActionExecutionResults()
    this.setState({timer: setInterval(this.refresh, this.state.autorefreshValue)})
  }

  componentWillUnmount() {
    const { resetActionExecutionResults } = this.props
    clearInterval(this.state.timer)
    resetActionExecutionResults()
  }

  togglePreComputingJobsAutorefresh() {
    this.setState(Object.assign({}, this.state, {autorefresh: !this.state.autorefresh}))
  }

  refresh() {
    const { autorefresh } = this.state
    const { loadActionExecutionResults } = this.props
    if(autorefresh) loadActionExecutionResults()
  }

  render() {

    const { autorefresh } = this.state
    const { actionExecutionResults, filters, areActionExecutionResultsFetching, total, actionExecutionResult } = this.props
    const { setActionExecutionResultsFilterKey, getActionExecutionResult, resetActionExecutionResult } = this.props 

    return (
      <PageWrapper>
        <div className="row">
          <div className="col">
            <h3>Launched actions</h3>
            <br/>
            <div className="form-group">
              <label>Autorefresh?</label>
              <input
                onChange={e => this.togglePreComputingJobsAutorefresh()}
                checked={autorefresh ? true : false}
                className="form-control"
                type="checkbox" />
            </div>
            <SmartDatatable
                manual
                sortable={false}
                showPaginationTop={true}
                onPageSizeChange={size => setActionExecutionResultsFilterKey("pageSize", size)}
                onPageChange={page => setActionExecutionResultsFilterKey("pageNumber", page)}
                pageSizeOptions={[20, 50, 100, 200]}
                page={filters.pageNumber}
                pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
                pageSize={filters.pageSize}
                loading={areActionExecutionResultsFetching}
                className="-striped -highlight"
                data={actionExecutionResults}
                columns={[
                    {
                      Header: "ID",
                      accessor: "id",
                      width: 50,
                    },
                    {
                      Header: "Timestamp",
                      id: "creationTimestamp",
                      accessor: action => date(get(action, "creationTimestamp")).calendar()
                    },
                    { 
                      Header: "Action", 
                      id: "actionName",
                      accessor: action => <Link target="blank" to={`/action/${action.actionId}`}>{get(action, "actionName")}</Link>
                    },
                    { 
                      Header: "Status", 
                      id: "success", 
                      className: "text-center", 
                      accessor: action => get(action, 'status') === 'InProgress' ? <Loading /> : (action.success ? <i className="icon-check text-success" /> : <i className="icon-close text-danger" />)
                    },
                    { 
                      Header: "Duration", 
                      id: "executionDuration", 
                      className: "text-center", 
                      accessor: action => duration(get(action, "executionDuration")).format("h [hrs], m [min], ss [s]") 
                    },
                    { 
                      Header: "Actions", 
                      id: "actions", 
                      className: "text-center", 
                      accessor: action => <button 
                        onClick={e => getActionExecutionResult(action.id)}
                        className="btn btn-sm btn-secondary"><i className="icon-magnifier" style={{top:"4px"}}/>&nbsp; Detail</button>
                    }
                ]} 
                />
          </div>
        </div>

        {/* Launched actions details */}
        <Drawer 
          onChange={opened => !opened && resetActionExecutionResult()}
          open={actionExecutionResult !== null}
          width={500}
          right={true}
          className="bg-white"
          >
          <div className="px-4 py-6">
            <h3>Launched action detail</h3>
            <br/>
            {actionExecutionResult && <ActionExecutionResult actionExecutionResult={actionExecutionResult} />}
          </div>
        </Drawer>

      </PageWrapper>
    )
  }
}

const mapStateToProps = state => ({

  filters: selectors.getActionExecutionResultsFilters(state),
  actionExecutionResults: selectors.getActionExecutionResults(state),
  total: selectors.getActionExecutionResultsTotal(state),
  areActionExecutionResultsFetching: selectors.areActionExecutionResultsFetching(state),
  actionExecutionResult: selectors.getActionExecutionResultDetail(state),

})

export default connect(
  mapStateToProps,
  actions
)(ActionExecutionResultsList)
