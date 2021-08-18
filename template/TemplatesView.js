import React, { useCallback, useEffect } from "react";
import usePaginatedData from "app/common/hooks/usePaginatedData";
import ActionsBar from "app/common/components/layout/ActionsBar";
import PageWrapper from "app/common/components/layout/PageWrapper";
import { filterStringValueLowerCase } from "app/common/utils/filterString";
import { Link } from "react-router-dom";
import SmartDatatable from "app/common/components/datatable/SmartDatatable";
import { getPagedTemplates } from "app/common/services/messaging";

function TemplatesView() {
  const [templates, fetchTemplates] = usePaginatedData();

  // fetch temlplates
  const fetch = useCallback(
    (pageNumber, pageSize) => {
      const promise = getPagedTemplates(pageNumber, pageSize);

      return fetchTemplates(promise, pageNumber, pageSize);
    },
    [fetchTemplates]
  );

  useEffect(() => {
    fetch(0, 20);
  }, [fetch]);

  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">Templates</h2>
        </div>
        <div className="col-8 text-right">
          <Link to={`/template`} className="btn btn-secondary">
            Create new template
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
              onPageSizeChange={size => fetch(templates.pageNumber, size)}
              onPageChange={page => fetch(page, templates.pageSize)}
              pageSizeOptions={[20, 50, 100, 200, 500, 1000]}
              page={templates.pageNumber}
              pages={Math.ceil(templates.total / templates.pageSize)}
              pageSize={templates.pageSize}
              data={templates.data}
              showPaginationTop={true}
              filterable={false}
              defaultFilterMethod={filterStringValueLowerCase}
              columns={[
                { Header: "ID", accessor: "id" },
                { Header: "Name", accessor: "name" },
                { Header: "Subject", accessor: "subject" },
                {
                  Header: "Targets",
                  id: "targets",
                  accessor: d => (d.targets || []).join(", ")
                },
                {
                  Header: "Actions",
                  id: "actions",
                  className: "text-center",
                  accessor: d => <Link to={`/template/${d.id}`}>Details</Link>
                }
              ]}
            />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default TemplatesView;
