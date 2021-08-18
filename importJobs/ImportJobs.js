import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import get from "lodash/get";
import update from "immutability-helper";
import PageWrapper from "../common/components/layout/PageWrapper";
import SmartDatatable from "../common/components/datatable/SmartDatatable";
import Loading from "../common/components/loaders/Loading";
import * as selectors from "./selectors";
import * as actions from "./actions";
import * as utils from "./utils";
import ImportProgressBar from "./ImportProgressBar";

const Actions = ({ id, excelFileUrl }) => {
  return (
    <div className="text-center">
      <Link className="btn btn-sm btn-light" to={`/tools/import-job/${id}`}>
        View report
      </Link>
      <a className="btn btn-sm btn-light ml-2" href={excelFileUrl}>
        Matrix
      </a>
    </div>
  );
};

class ImportJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { filters, autorefreshTimer } = this.props;
    const { applyImportJobsFilters } = this.props;
    applyImportJobsFilters(filters);
    this.setState({ timer: setInterval(this.refresh, autorefreshTimer) });
  }

  refresh() {
    const { filters, autorefresh } = this.props;
    const { applyImportJobsFilters } = this.props;
    if (autorefresh) applyImportJobsFilters(filters);
  }

  componentWillUnmount() {
    const { resetImportJobs } = this.props;
    clearInterval(this.state.timer);
    resetImportJobs();
  }

  render() {
    const { importJobs, filters, autorefresh, total } = this.props;
    const { applyImportJobsFilters, toggleImportJobsAutorefresh } = this.props;

    return (
      <PageWrapper>
        <div className="row">
          <div className="col-12">
            <h3>Import jobs</h3>
            <br />
            <div className="form-group">
              <label>Autorefresh?</label>
              <input
                onChange={e => toggleImportJobsAutorefresh()}
                checked={autorefresh ? true : false}
                className="form-control"
                type="checkbox"
              />
            </div>

            <SmartDatatable
              data={importJobs}
              sortable={false}
              showPaginationTop={true}
              onPageSizeChange={size =>
                applyImportJobsFilters(
                  update(filters, { pageSize: { $set: size } })
                )
              }
              onPageChange={page =>
                applyImportJobsFilters(
                  update(filters, { pageNumber: { $set: page } })
                )
              }
              pageSizeOptions={[5, 10, 20, 25, 50, 100, 200]}
              manual
              page={filters.pageNumber}
              pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
              pageSize={filters.pageSize}
              className="-striped -highlight"
              columns={[
                {
                  Header: "Manufacturer name",
                  id: "manufacturerEntity.name",
                  accessor: d => (
                    <React.Fragment>
                      {get(d, "manufacturerEntity.name")}
                      {!utils.isImportDone(d) && (
                        <Loading className="float-right" />
                      )}
                    </React.Fragment>
                  )
                },
                {
                  Header: "To import",
                  className: "text-center",
                  accessor: "countTradeItemToImport"
                },
                {
                  Header: "Business rules validation",
                  columns: [
                    {
                      Header: "Validated",
                      className: "text-center",
                      accessor: "countTradeItemValidated"
                    },
                    {
                      Header: "Rejected",
                      className: "text-center",
                      id: "countTradeItemRejected",
                      accessor: d =>
                        (get(d, "countTradeItemRejected") > 0 && (
                          <span className="badge badge-pill badge-danger">
                            {get(d, "countTradeItemRejected")}
                          </span>
                        )) ||
                        0
                    }
                  ]
                },
                {
                  Header: "Persistence",
                  columns: [
                    {
                      Header: "Imported",
                      className: "text-center",
                      accessor: "countTradeItemImported"
                    },
                    {
                      Header: "Not changed",
                      className: "text-center",
                      accessor: "countTradeItemNotChanged"
                    },
                    {
                      Header: "Failed",
                      className: "text-center",
                      id: "countTradeItemImportFailed",
                      accessor: d =>
                        (get(d, "countTradeItemImportFailed") > 0 && (
                          <span className="badge badge-pill badge-danger">
                            {get(d, "countTradeItemImportFailed")}
                          </span>
                        )) ||
                        0
                    },
                    {
                      Header: "Inconsistencies",
                      className: "text-center",
                      accessor: "countTradeItemNotConsistent"
                    }
                  ]
                },
                {
                  Header: "Progression",
                  id: "progression",
                  accessor: d => <ImportProgressBar importJob={d} />
                },
                {
                  Header: "Start",
                  id: "startTimestamp",
                  accessor: d => utils.getStartDate(d)
                },
                {
                  Header: "End",
                  id: "endTimestamp",
                  accessor: d => utils.getEndDate(d)
                },
                {
                  Header: "Duration",
                  id: "duration",
                  accessor: d => (
                    <div className="text-center">
                      {utils.getTotalDuration(d)}
                    </div>
                  )
                },
                {
                  Header: "Actions",
                  id: "actions",
                  accessor: Actions
                }
              ]}
            />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    importJobs: selectors.getImportJobs(state),
    filters: selectors.getImportJobsFilters(state),
    total: selectors.getImportJobsTotal(state),
    autorefresh: selectors.getImportJobsAutorefresh(state),
    jobDetails: selectors.getImportJobDetail(state),
    autorefreshTimer: 1500
  };
};

export default withRouter(connect(mapStateToProps, actions)(ImportJobs));
