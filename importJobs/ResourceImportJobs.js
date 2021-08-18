import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import SmartDatatable from "../common/components/datatable/SmartDatatable";
import { filterStringValueLowerCase } from "../common/utils/filterString";
import usePaginatedData from "../common/hooks/usePaginatedData";
import { getResourceImportJobs } from "app/common/services/importResource";
import PageWrapper from "app/common/components/layout/PageWrapper";
import LegacyVideoImport from "./LegacyVideoImport";
import Loading from "app/common/components/loaders/Loading";
import * as utils from "./utils";
import ImportProgressBar from "./ImportProgressBar";

const ResourceImportJobs = (props) => {

  const [importJobs, fetchImportJobs] = usePaginatedData();
  const [autorefresh, setAutorefresh] = useState(props.defaultAutorefresh === true);

  // fetch subscriptions
  const fetch = useCallback(
    (pageNumber, pageSize) => {
      if(!props.loadingUpdated){
        const promise = getResourceImportJobs(pageNumber, pageSize);

        return fetchImportJobs(promise, pageNumber, pageSize);
      }
    },
    [fetchImportJobs]
  );

  useEffect(() => {
    fetch(0, 10);
    const intervalId =
      autorefresh &&
      setInterval(() => {
        fetch(0, 10);
      }, 10000);
    return () => autorefresh && clearInterval(intervalId);
  }, [fetch, autorefresh]);

  return (
    <PageWrapper>
      <div className="row">
        <div className="col-12">
          <h3>Resource import jobs</h3>
          <br />
          <div className="form-group">
            <label>Autorefresh?</label>
            <input
              onChange={e => setAutorefresh(au => !au)}
              checked={!!autorefresh}
              className="form-control"
              type="checkbox"
            />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <LegacyVideoImport />
          </div>
          <SmartDatatable
            manual
            sortable={false}
            onPageSizeChange={size => fetch(importJobs.pageNumber, size)}
            onPageChange={page => fetch(page, importJobs.pageSize)}
            pageSizeOptions={[20, 50, 100, 200, 500, 1000]}
            page={importJobs.pageNumber}
            pages={Math.ceil(importJobs.total / importJobs.pageSize)}
            pageSize={importJobs.pageSize}
            data={importJobs.data}
            showPaginationTop={true}
            filterable
            defaultFilterMethod={filterStringValueLowerCase}
            columns={[
              { Header: "ID", accessor: "id" },
              {
                Header: "Manufacturer entity",
                id: "manufacturerEntity.name",
                width: 230,
                accessor: d => (
                  <React.Fragment>
                    {get(d, "manufacturerEntity.name")}
                    {!utils.isImportDone({
                      ...d,
                      countTradeItemImported: d.success,
                      countTradeItemNotChanged: d.notHandled,
                      countTradeItemToImport: d.total,
                      countTradeItemImportFailed: d.failed,
                      countTradeItemRejected: 0
                    }) && <Loading className="float-right" />}
                  </React.Fragment>
                )
              },
              {
                Header: "Total",
                className: "text-center",
                width: 80,
                accessor: "total"
              },
              {
                Header: "Imported",
                className: "text-center",
                width: 80,
                accessor: "success"
              },
              {
                Header: "Not handled",
                className: "text-center",
                width: 80,
                accessor: "notHandled"
              },
              {
                Header: "Failed",
                className: "text-center",
                width: 80,
                id: "failed",
                accessor: d =>
                  (get(d, "failed") > 0 && (
                    <span className="badge badge-pill badge-danger">
                      {get(d, "failed")}
                    </span>
                  )) ||
                  0
              },
              {
                Header: "Progression",
                id: "progression",
                accessor: d => (
                  <ImportProgressBar
                    importJob={{
                      ...d,
                      countTradeItemImported: d.success,
                      countTradeItemNotChanged: d.notHandled,
                      countTradeItemToImport: d.total,
                      countTradeItemImportFailed: d.failed,
                      countTradeItemRejected: 0
                    }}
                  />
                )
              },
              {
                Header: "Start",
                id: "creationTimestamp",
                className: "text-center",
                accessor: d =>
                  utils.getStartDate({
                    ...d,
                    startTimestamp: d.creationTimestamp
                  })
              },
              {
                Header: "End",
                id: "endTimestamp",
                className: "text-center",
                accessor: d =>
                  utils.getEndDate({ ...d, endTimestamp: d.updateTimestamp })
              },
              {
                Header: "Duration",
                id: "duration",
                accessor: d => (
                  <div className="text-center">
                    {utils.getTotalDuration({
                      ...d,
                      startTimestamp: d.creationTimestamp,
                      endTimestamp: d.updateTimestamp
                    })}
                  </div>
                )
              },
              {
                Header: "Actions",
                id: "actions",
                className: "text-center",
                filterable: false,
                accessor: d => (
                  <Link to={`/resource-import-job/${d.id}`}>Details</Link>
                )
              }
            ]}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ResourceImportJobs;
