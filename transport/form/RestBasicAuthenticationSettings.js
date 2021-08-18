import React from "react" 
import get from "lodash/get"


const RestBasicAuthenticationSettings = ({
    authenticationSettings,
    onChange,
}) => (
    <React.Fragment>

        <div className="row">

            <div className="col-6">

                {/* Username */}
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                        onChange={e => onChange("username", e.target.value)}
                        value={get(authenticationSettings, "username") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="control-label">Password</label>
                    <input
                        onChange={e => onChange("password", e.target.value)}
                        value={get(authenticationSettings, "password") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>


            </div>
        </div>

    </React.Fragment>
)


export default RestBasicAuthenticationSettings