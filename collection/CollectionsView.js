import React, { useCallback, useEffect } from "react";
import usePaginatedData from "app/common/hooks/usePaginatedData";
import { getPagedCollections } from "app/common/services/collection ";
import ActionsBar from "app/common/components/layout/ActionsBar";
import PageWrapper from "app/common/components/layout/PageWrapper";
import { filterStringValueLowerCase } from "app/common/utils/filterString";
import { date } from "app/common/utils/date";
import { Link } from "react-router-dom";
import SmartDatatable from "app/common/components/datatable/SmartDatatable";

function CollectionsView() {
  const [collections, fetchCollections] = usePaginatedData();

  // fetch collections
  const fetch = useCallback(
    (pageNumber, pageSize) => {
      const promise = getPagedCollections(pageNumber, pageSize);

      return fetchCollections(promise, pageNumber, pageSize);
    },
    [fetchCollections]
  );

  useEffect(() => {
    fetch(0, 20);
  }, [fetch]);

  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">Collections</h2>
        </div>
        <div className="col-8 text-right">
          <Link to={`/collections`} className="btn btn-light mr-2">
            Go back to list
          </Link>
          <Link to={`/collection`} className="btn btn-secondary">
            Create new collection
          </Link>
        </div>
      </ActionsBar>

      {/* Table */}
      <PageWrapper>
        <div className="row">
          <div className="col">
            <SmartDatatable
              manual
              sortable={false}
              onPageSizeChange={size => fetch(collections.pageNumber, size)}
              onPageChange={page => fetch(page, collections.pageSize)}
              pageSizeOptions={[20, 50, 100, 200, 500, 1000]}
              page={collections.pageNumber}
              pages={Math.ceil(collections.total / collections.pageSize)}
              pageSize={collections.pageSize}
              data={collections.data}
              showPaginationTop={true}
              filterable={false}
              defaultFilterMethod={filterStringValueLowerCase}
              columns={[
                { Header: "ID", accessor: "id" },
                { Header: "Name", accessor: "name" },
                {
                  Header: "Start date",
                  id: "startDate",
                  accessor: d => date(d.startDate).format("YYYY-MM-DD hh:mm:ss")
                },
                {
                  Header: "End date",
                  id: "endDate",
                  accessor: d => date(d.endDate).format("YYYY-MM-DD hh:mm:ss")
                },
                {
                  Header: "Actions",
                  id: "actions",
                  className: "text-center",
                  accessor: d => <Link to={`/collection/${d.id}`}>Details</Link>
                }
              ]}
            />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default CollectionsView;
