import React from "react"
import get from "lodash/get"
import map from "lodash/map"
import { Link } from "react-router-dom"
import { duration } from "../common/utils/date"


const ActionExecutionResult = ({
    actionExecutionResult
}) => (
    <React.Fragment>
        
        {/* Action name */}
        <p>
            <Link 
                target="blank" 
                to={`/action/${get(actionExecutionResult, "actionId")}`}>{get(actionExecutionResult, "actionName")}</Link>
        </p>
        
        {/* Success */}
        <p className="mb-3">Status: {get(actionExecutionResult, "success", false) ? <i className="icon-check text-success" /> : <i className="icon-close text-danger" />}</p>
        
        {/* Duration */}
        <p className="mb-3">Duration: {duration(get(actionExecutionResult, "executionDuration")).format("h [hrs], m [min], ss [s]")}</p>

        {/* Parameters */}
        <div className="mb-3">
            <p>Parameters:</p>
            <pre>{JSON.stringify(get(actionExecutionResult, "parameters"), null, 2)}</pre>
        </div>

        {/* Parameters */}
        <div className="mb-3">
            <p>Output:</p>
            <pre>{JSON.stringify(get(actionExecutionResult, "output"), null, 2)}</pre>
        </div>

        {/* Errors */}
        <div className="mb-3">
            <p>Errors:</p>
            {map(get(actionExecutionResult, "errorMessages"), (error, errorKey) => (
                <p
                    className="border-bottom"
                    key={`error-detail-${errorKey}`}
                    >
                    {get(error, "message")}
                </p>
            ))}
        </div>

    </React.Fragment>
)

export default ActionExecutionResult