import React from "react";
import ActionsBar from "../common/components/layout/ActionsBar";
import ResourceImportJobs from "./ResourceImportJobs";

const ResourceImportJobsView = () => {
  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">
            Resource import jobs
          </h2>
        </div>
      </ActionsBar>

      <ResourceImportJobs defaultAutorefresh={true} />
    </div>
  );
};

export default ResourceImportJobsView;
