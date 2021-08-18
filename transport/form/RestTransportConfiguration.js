import React from "react" 
import get from "lodash/get"
import map from "lodash/map"
import find from "lodash/find"
import Select from "react-select"
import RestBasicAuthenticationSettings from "./RestBasicAuthenticationSettings"
import RestTokenAuthenticationSettings from "./RestTokenAuthenticationSettings"
import { getRestAPIMethods } from "../utils"

const getDefaultHeader = () => { return {
    name: "",
    valuePattern: "",
}}

const DynamicAuthenticationSettings = props => {
    switch(get(props, "authenticationSettings.discriminator")) {
        
        case "BasicAuthenticationSettingsViewModel":
            return <RestBasicAuthenticationSettings {...props} />
        
        case "TokenAuthenticationSettingsViewModel":
            return <RestTokenAuthenticationSettings {...props} />

        default:
            return <div>Authentication settings not implemented {get(props, "authenticationSettings.discriminator")}</div>

    }
}

  

const RestTransportConfiguration = ({
    transportConfiguration,
    onChange,
}) => (
    <React.Fragment>

        <div className="row">

            <div className="col-6">

                {/* URL pattern */}
                <div className="form-group">
                    <label className="control-label">URL pattern</label>
                    <input
                        onChange={e => onChange("urlPattern", e.target.value)}
                        value={get(transportConfiguration, "urlPattern") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Method */}
                <div className="form-group">
                    <label className="control-label">Method</label>
                    <Select
                        onChange={option => onChange("method", option.value)}
                        value={find(getRestAPIMethods(), m => m.value === get(transportConfiguration, "method"))}
                        options={getRestAPIMethods()}
                        />
                </div>

                {/* Content type */}
                <div className="form-group">
                    <label className="control-label">Content type</label>
                    <input
                        placeholder="application/json"
                        onChange={e => onChange("contentType", e.target.value)}
                        value={get(transportConfiguration, "contentType") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>

                {/* Headers */}
                <div className="form-group">
                    <label className="control-label">Headers</label>
                    <div>
                        {map(get(transportConfiguration, "headers", []), (header, headerKey) => (
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
                                                ...get(transportConfiguration, `headers`, []).slice(0, headerKey),
                                                ...get(transportConfiguration, `headers`, []).slice(headerKey + 1)                                                
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
                                ...get(transportConfiguration, `headers`, []),
                                getDefaultHeader()
                            ])
                        }}
                        className="btn btn-sm btn-secondary"
                        >+ Add header</button>
                </div>

                {/* Body Pattern */}
                <div className="form-group">
                    <label className="control-label">Body Pattern</label>
                    <textarea
                        onChange={e => onChange("bodyPattern", e.target.value)}
                        value={get(transportConfiguration, "bodyPattern") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>
            </div>


            <div className="col-6">                

                {/* Authentication setting */}
                <div className="btn-group mb-3" role="group">
                    <button
                        onClick={e => onChange("authenticationSettings", null)}
                        type="button"
                        className={`btn btn-secondary ${get(transportConfiguration, "authenticationSettings", null) === null ? "active" : ""}`}>None</button>
                    <button
                        onClick={e => onChange("authenticationSettings", {discriminator: "BasicAuthenticationSettingsViewModel"})}
                        type="button"
                        className={`btn btn-secondary ${get(transportConfiguration, "authenticationSettings.discriminator") === "BasicAuthenticationSettingsViewModel" ? "active" : ""}`}>Basic</button>
                    <button
                        onClick={e => onChange("authenticationSettings", {discriminator: "TokenAuthenticationSettingsViewModel"})}
                        type="button"
                        className={`btn btn-secondary ${get(transportConfiguration, "authenticationSettings.discriminator") === "TokenAuthenticationSettingsViewModel" ? "active" : ""}`}>Token</button>
                </div>

                {get(transportConfiguration, "authenticationSettings.discriminator") && <DynamicAuthenticationSettings 
                    onChange={(key, value) => onChange(`authenticationSettings.${key}`, value)}
                    authenticationSettings={transportConfiguration.authenticationSettings} />}

                {/* Acknowlegement expected */}
                <div className="form-group">
                    <label className="control-label">Acknowledgement expected</label>
                    <div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input 
                                onChange={e => onChange("acknowledgeExpected", true)}
                                checked={get(transportConfiguration, "acknowledgeExpected", false) === true}
                                type="radio" 
                                id="acknowledgeExpected" 
                                name="acknowledgeExpected" 
                                className="custom-control-input" 
                                />
                            <label className="custom-control-label" htmlFor="acknowledgeExpected">Yes</label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input 
                                onChange={e => onChange("acknowledgeExpected", false)}
                                checked={get(transportConfiguration, "acknowledgeExpected", false) === false}
                                type="radio" 
                                id="ackExpectedNo" 
                                name="acknowledgeExpected" 
                                className="custom-control-input" 
                            />
                            <label className="custom-control-label" htmlFor="ackExpectedNo">No</label>
                        </div>
                    </div>
                </div>

                {/* Acknowledgement timeout */}
                {get(transportConfiguration, "acknowledgeExpected", false) && <div className="form-group">
                    <label className="control-label">Acknowledgement timeout</label>
                    <input
                        onChange={e => onChange("acknowledgeTimeout", e.target.value)}
                        value={get(transportConfiguration, "acknowledgeTimeout") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>}

                {/* Submission id regex */}
                {get(transportConfiguration, "acknowledgeExpected", false) && <div className="form-group">
                    <label className="control-label">Submission ID regex</label>
                    <input
                        onChange={e => onChange("submissionIdRegex", e.target.value)}
                        value={get(transportConfiguration, "submissionIdRegex") || ""}
                        className="form-control"
                        type="text" 
                        />
                </div>}

            </div>

        </div>

    </React.Fragment>
)


export default RestTransportConfiguration