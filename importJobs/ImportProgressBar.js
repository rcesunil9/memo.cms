import React from "react"
import get from "lodash/get"
import * as utils from "./utils"


const ImportProgressBar = ({
    importJob
}) => (
    <React.Fragment>
        {/* Progress bar */}
        <div className="progress" id={`import-progress-${get(importJob, "id")}`} key={`import-progress-${get(importJob, "id")}`}>
            <div className={`progress-bar ${utils.isImportSuccess(importJob) ? "bg-success": ""}`} role="progressbar" style={{width: `${utils.getSuccessProgressionPercentage(importJob)}%`}}></div>
            <div className="progress-bar bg-danger" role="progressbar" style={{width: `${utils.getFailedProgressionPercentage(importJob)}%`}}></div>
        </div>
    </React.Fragment>
)

export default ImportProgressBar