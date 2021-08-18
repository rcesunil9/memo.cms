import React from "react"
import get from "lodash/get"
import dotProp from "dot-prop-immutable"

const AmazonJSONValidator = ({configuration, onChange}) => (
    <React.Fragment>
        <div className="form-row">
            <div className="col">
                <label className="control-label">Version</label>
                <input 
                    value={get(configuration, "version") || ""}
                    onChange={e => onChange(dotProp.set(configuration, "version", e.target.value))}
                    type="text" 
                    className="form-control"
                    />
            </div>
            <div className="col">
                <label className="control-label">Target market code</label>
                <input 
                    value={get(configuration, "amazonTargetMarketCode") || ""}
                    onChange={e => onChange(dotProp.set(configuration, "amazonTargetMarketCode", e.target.value))}
                    type="text" 
                    className="form-control"
                    />
            </div>
        </div>
    </React.Fragment>
)

export default AmazonJSONValidator