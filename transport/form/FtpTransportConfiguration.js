import React from "react" 
import get from "lodash/get"


const FtpTransportConfiguration = ({
    transportConfiguration,
    onChange,
}) => (
    <React.Fragment>

        <div className="row">
 
            <div className="col-6">

                {/* URL */}
                <div className="form-group">
                    <label className="control-label">URL</label>
                    <input
                        onChange={e => onChange("url", e.target.value)}
                        value={get(transportConfiguration, "url") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Username */}
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                        onChange={e => onChange("username", e.target.value)}
                        value={get(transportConfiguration, "username") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="control-label">Password</label>
                    <input
                        onChange={e => onChange("password", e.target.value)}
                        value={get(transportConfiguration, "password") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Path */}
                <div className="form-group">
                    <label className="control-label">Path</label>
                    <input
                        onChange={e => onChange("path", e.target.value)}
                        value={get(transportConfiguration, "path") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* File name pattern */}
                <div className="form-group">
                    <label className="control-label">File name pattern</label>
                    <input
                        onChange={e => onChange("filenamePattern", e.target.value)}
                        value={get(transportConfiguration, "filenamePattern") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

            </div>

        </div>

    </React.Fragment>
)


export default FtpTransportConfiguration