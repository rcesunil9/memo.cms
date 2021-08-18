import React from "react";
import ImportJobs from "./importJobs/ImportJobs";
import ExportJobs from "./exportJobs/ExportJobs";
import ResourceImportJobs from "./importJobs/ResourceImportJobs";

const Dashboard = () => (
  <>
    {/* Export jobs */}
    <ExportJobs />

    {/* Import jobs */}
    <ImportJobs />

    {/* Resource import jobs */}
    <ResourceImportJobs defaultAutorefresh={true} />
  </>
);

export default Dashboard;
