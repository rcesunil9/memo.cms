import React, { useEffect, useState, useMemo } from "react"
import get from "lodash/get"
import * as utils from "./utils"
import { getPreComputingJob } from "app/common/services/preComputing"

const figureStyle = {
    position: 'absolute',
    left: '0'
}

const Figure = ({ nb }) => {
    return (
        <>
            {nb > 0 && <div style={figureStyle}>{nb}</div>}
        </>
    )
}

const ExportProgressBar = ({
    job,
    showFigure,
    ...otherProps
}) => {
    const successValue = useMemo(() => utils.getSuccessProgressionPercentage(job), [ job ])
    const failureValue = useMemo(() => utils.getFailedProgressionPercentage(job), [ job ])

    return (
        <div className="progress" id={`import-progress-${get(job, "id")}`} key={`import-progress-${get(job, "id")}`} {...otherProps}>
            <div className={`progress-bar ${utils.isJobSuccess(job) ? "bg-success": ""}`} role="progressbar" style={{position: 'relative', width: `${successValue}%`}}>
                {showFigure && <Figure nb={successValue}/>}
            </div>
            <div className="progress-bar bg-danger" role="progressbar" style={{position: 'relative', width: `${failureValue}%`}}>
                {showFigure && <Figure nb={failureValue}/>}
            </div>
        </div>
    )
}

const ExportProgressBarFetch = ({ jobId, ...otherProps }) => {
    const [job, setJob] = useState(null)

    useEffect(() => {
        getPreComputingJob(jobId).then(res => setJob(get(res, 'data')))

    }, [jobId])

    if (!job) return '...'

    return <ExportProgressBar job={job} {...otherProps}/>
}

export { ExportProgressBarFetch }

export default ExportProgressBar