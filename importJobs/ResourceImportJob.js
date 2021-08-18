import React, { useCallback, useEffect, useState } from "react";
import size from "lodash/size";
import PageWrapper from "../common/components/layout/PageWrapper";
import usePaginatedData from "app/common/hooks/usePaginatedData";
import { getResourceImportFailedJobs } from "app/common/services/importResource";
import SmartDatatable from "app/common/components/datatable/SmartDatatable";
import debounce from "lodash/debounce";
import ReactDOM from "react-dom";
import Modal from "app/common/components/layout/Modal";

const DEFAULT_PAGE_SIZE = 100;

function ResourceImportJob({ resourceImportJobId }) {
  const [failedJobs, fetchFailedJobs] = usePaginatedData({
    pageSize: DEFAULT_PAGE_SIZE
  });
  const [selectedJob, setSelectedJob] = useState(null);

  // fetch subscriptions
  const fetch = useCallback(
    (pageNumber, pageSize, searchVal) => {
      const promise = getResourceImportFailedJobs(
        resourceImportJobId,
        pageNumber,
        pageSize,
        searchVal
      );
      return fetchFailedJobs(promise, pageNumber, pageSize);
    },
    [fetchFailedJobs, resourceImportJobId]
  );

  const debouncedSetSearch = useCallback(
    debounce(filter => {
      if (!size(filter) || filter[0] === undefined) {
        fetch(0, DEFAULT_PAGE_SIZE, null);
        return;
      }
      const filterValue = filter[0].value.toLowerCase();
      fetch(0, DEFAULT_PAGE_SIZE, filterValue);
      return true;
    }, 350),
    [fetch]
  );

  useEffect(() => {
    fetch(0, DEFAULT_PAGE_SIZE, null);
  }, [fetch]);

  return (
    <PageWrapper>
      <SmartDatatable
        manual
        sortable={false}
        onPageSizeChange={size => fetch(failedJobs.pageNumber, size)}
        onPageChange={page => fetch(page, failedJobs.pageSize)}
        pageSizeOptions={[20, 50, 100, 200, 500, 1000]}
        page={failedJobs.pageNumber}
        pages={Math.ceil(failedJobs.total / failedJobs.pageSize)}
        pageSize={failedJobs.pageSize}
        data={failedJobs.data}
        showPaginationTop={true}
        filterable
        defaultFilterMethod={debouncedSetSearch}
        onFilteredChange={debouncedSetSearch}
        columns={[
          { Header: "ID", accessor: "id", filterable: false, width: 300 },
          { Header: "Full path", accessor: "fullPath", width: 500 },
          {
            Header: "Reason",
            id: "reason",
            filterable: false,
            accessor: d => (
              <div
                title={d.reason}
                onClick={e =>
                  ReactDOM.createPortal(<div>OK</div>, document.body)
                }
              >
                {d.reason}
              </div>
            )
          },
          {
            Header: "Actions",
            id: "actions",
            className: "text-center",
            width: 200,
            filterable: false,
            accessor: d => (
              <button
                className="secondary btn btn-sm"
                onClick={() => setSelectedJob(d)}
              >
                Detail
              </button>
            )
          }
        ]}
      />

      {selectedJob && (
        <Modal title="Import job detail" onClose={() => setSelectedJob(null)}>
          <div>{selectedJob.reason}</div>
        </Modal>
      )}
    </PageWrapper>
  );
}

export default ResourceImportJob;
