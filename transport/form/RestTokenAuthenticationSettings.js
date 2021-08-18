import React from "react" 
import get from "lodash/get"
import map from "lodash/map"
import find from "lodash/find"
import Select from "react-select"
import { getRestAPIMethods } from "../utils"


const getDefaultHeader = () => { return {
    name: "",
    valuePattern: "",
}}

const RestTokenAuthenticationSettings = ({
    authenticationSettings,
    onChange,
}) => (
    <React.Fragment>

        <div className="row">

            <div className="col">

                <h4>Authentication settings</h4>

                {/* URL */}
                <div className="form-group">
                    <label className="control-label">Token endpoint</label>
                    <input
                        onChange={e => onChange("url", e.target.value)}
                        value={get(authenticationSettings, "url") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Method */}
                <div className="form-group">
                    <label className="control-label">Method</label>
                    <Select
                        onChange={option => onChange("method", option.value)}
                        value={find(getRestAPIMethods(), m => m.value === get(authenticationSettings, "method"))}
                        options={getRestAPIMethods()}
                        />
                </div>

                {/* Content-type */}
                <div className="form-group">
                    <label className="control-label">Content-Type</label>
                    <input
                        onChange={e => onChange("contentType", e.target.value)}
                        value={get(authenticationSettings, "contentType") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Content */}
                <div className="form-group">
                    <label className="control-label">Content</label>
                    <textarea 
                        rows={5}
                        onChange={e => onChange("content", e.target.value)}
                        value={get(authenticationSettings, "content") || ""}
                        className="form-control"
                        />
                </div>

                {/* Headers */}
                <div className="form-group">
                    <label className="control-label">Headers</label>
                    <div>
                        {map(get(authenticationSettings, "headers", []), (header, headerKey) => (
                            <div 
                                key={`rest-api-header-${headerKey}`}
                                className="form-row align-items-center mb-3"
                                >

                                <div className="col-sm-3">
                                    <input
                                        placeholder="Name"
                                        onChange={e => onChange(`headers.${headerKey}.name`, e.target.value)}
                                        value={header.name || ""}
                                        className="form-control"
                                        type="text" 
                                        />
                                </div>

                                <div className="col-sm-7">
                                    <input
                                        placeholder="Value pattern"
                                        onChange={e => onChange(`headers.${headerKey}.valuePattern`, e.target.value)}
                                        value={header.valuePattern || ""}
                                        className="form-control"
                                        type="text" 
                                        />
                                </div>

                                <div className="col-sm-2">
                                    <button
                                        onClick={e => {
                                            onChange(`headers`, [
                                                ...get(authenticationSettings, `headers`, []).slice(0, headerKey),
                                                ...get(authenticationSettings, `headers`, []).slice(headerKey + 1)                                                
                                            ])
                                        }}
                                        className="btn btn-sm btn-danger"
                                        >
                                        Remove</button>
                                </div>

                            </div>

                        ))}
                    </div>
                    <button
                        onClick={e => {
                            onChange(`headers`, [
                                ...get(authenticationSettings, `headers`, []),
                                getDefaultHeader()
                            ])
                        }}
                        className="btn btn-sm btn-secondary"
                        >+ Add header</button>
                </div>


            </div>
        </div>

    </React.Fragment>
)


export default RestTokenAuthenticationSettings