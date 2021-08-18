import React from "react";
import ActionsBar from "../common/components/layout/ActionsBar";
import ResourceImportJob from "./ResourceImportJob";
import { withRouter } from "react-router";

const ResourceImportJobView = ({ match }) => {
  const id = match.params.id;
  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">
            Resource import job detail
          </h2>
        </div>
      </ActionsBar>

      <ResourceImportJob resourceImportJobId={id} defaultAutorefresh={true} />
    </div>
  );
};

export default withRouter(ResourceImportJobView);
