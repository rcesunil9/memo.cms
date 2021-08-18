import React, { useState, useEffect } from "react"
import get from 'lodash/get'
import map from 'lodash/map'
import { Link } from 'react-router-dom'
import Card from "app/common/components/layout/Card"
import { Formula } from 'app/common/components/formula/Formula'
import { getTransportConfiguration } from "app/common/services/transportManagement"

const Password = ({ password }) => {
    const [showPwd, setShowPwd] = useState(null)

    return showPwd ? password : <span style={{cursor: 'pointer'}} onClick={() => setShowPwd(true)}>*****</span>
}

const BasicAuthenticationSettingsViewModel = ({
    username,
    password,
}) => {
    return (
        <div>
            UserName: {username}<br/>
            Password: <Password password={password}/><br/>
        </div>
    )
}

const TokenAuthenticationSettingsViewModel = ({
    content,
    contentType,
    method,
    url,
    headers
}) => {
    return (
        <div>
            Method: {method}<br/>
            Url: {url}<br/>
            ContentType: {contentType}<br/>
            Content: <pre>{content}</pre><br/>
            <br/>

            <label className="control-label">Headers</label>
            <div style={{border: '1px solid #eee', padding: '10px 10px'}}>
                {map(headers, (header, idx) => (
                    <div key={`rest-conf-${idx}`}>
                        {header.name}: {header.valuePattern}
                    </div>
                ))}
            </div>
        </div>
    )
}



const RestTransportConfigurationViewModel = ({
    acknowledgeExpected,
    acknowledgeTimeout,
    authenticationSettings,
    bodyPattern,
    contentType,
    headers,
    method,
    submissionIdRegex,
    urlPattern

}) => {
    return (
        <>
            <div>
                Method: {method}<br/>
                ContentType: {contentType}<br/>
                UrlPattern: <pre>{urlPattern}</pre><br/>
                AcknowledgeExpected: {acknowledgeExpected ? 'y' : 'n'}<br/>
                AcknowledgeTimeout: {acknowledgeTimeout}<br/>
                SubmissionIdRegex: <pre>{submissionIdRegex}</pre><br/>
                {bodyPattern && <>BodyPattern: <Formula>{bodyPattern}</Formula><br/></>}
            </div>

            <label className="control-label">Headers</label>
            <div style={{border: '1px solid #eee', padding: '10px 10px'}}>
                {map(headers, (header, idx) => (
                    <div key={`rest-conf-${idx}`}>
                        {header.name}: {header.valuePattern}
                    </div>
                ))}
            </div>
            <br/>

            <label className="control-label">Auth.</label>
            <div style={{border: '1px solid #eee', padding: '10px 10px'}}>
                {get(authenticationSettings, 'discriminator') === 'BasicAuthenticationSettingsViewModel' && <BasicAuthenticationSettingsViewModel {...authenticationSettings}/>}
                {get(authenticationSettings, 'discriminator') === 'TokenAuthenticationSettingsViewModel' && <TokenAuthenticationSettingsViewModel {...authenticationSettings}/>}
            </div>
            
        </>
    )
}

const FtpTransportConfigurationViewModel = ({ filenamePattern, password, path, url, username }) => {
    return (
        <>
            <label className="control-label">URL</label>
            <p>{url}</p>
            <label className="control-label">Username</label>
            <p>{username}</p>
            <label className="control-label">Password</label>
            <p><Password password={password}/></p>
            <label className="control-label">Path</label>
            <p>{path}</p>
            <label className="control-label">FilenamePattern</label>
            <pre>{filenamePattern}</pre>
        </>
    )
}

const ExportTransportDetail = ({ transportConfigurationId }) => {
    const [ transportConfiguration, setTransportConfiguration ] = useState(null)

    useEffect(() => {
        getTransportConfiguration(transportConfigurationId).then(res => setTransportConfiguration(get(res, 'data')))
    }, [transportConfigurationId])

    if (transportConfiguration === null) return <>--</>

    return (
        <Card>
            <h3>Transport</h3>
            <br/>

            <div className="mb-3">
                <Link target='_blank' to={`/transport-configuration/${transportConfigurationId}`}>{transportConfiguration.name}</Link>
            </div>

            {transportConfiguration.discriminator === 'FtpTransportConfigurationViewModel' && <FtpTransportConfigurationViewModel {...transportConfiguration}/>}
            {transportConfiguration.discriminator === 'RestTransportConfigurationViewModel' && <RestTransportConfigurationViewModel {...transportConfiguration}/>}

        </Card>
    )

}

export default ExportTransportDetail
