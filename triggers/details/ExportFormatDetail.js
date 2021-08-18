import React, { useState, useEffect } from "react"
import get from 'lodash/get'
import map from 'lodash/map'
import { Link } from 'react-router-dom'
import Card from "app/common/components/layout/Card"
import { getFormatById } from "app/common/services/exportFormats"
import { BusinessRuleSet } from "./BusinessRulesDetail"
import { Formula } from 'app/common/components/formula/Formula'

const AmazonTemplateSpecificationViewModel = ({ amazonTargetMarketCode, businessRuleSetId, version, template }) => {
    return (
        <>
            <label className="control-label">Amazon info.</label>
            <div>
                AmazonTargetMarketCode: {amazonTargetMarketCode},
                Version: {version}
            </div>

            <br/>

            {businessRuleSetId && (
                <>
                    <label className="control-label">Business Rule Set</label>
                    <BusinessRuleSet id={businessRuleSetId} name={`amazon-tpl-${businessRuleSetId}`}/>
                </>
                )}

            <br/>

            <label className="control-label">Template</label>
            <Formula>{template}</Formula>
        </>
    )
}

const ValidableTemplateSpecificationViewModel = ({ businessRuleSetId, type, validator, template }) => {
    return (
        <>
            <label className="control-label">Template info.</label>
            <div>
                Type: {type}
            </div>

            <br/>

            {businessRuleSetId && (
                <>
                    <label className="control-label">Business Rule Set</label>
                    <BusinessRuleSet id={businessRuleSetId} name={`validable-tpl-${businessRuleSetId}`}/>
                    <br/>
                </>
                )}

            {validator && (
                <>
                    <label className="control-label">Validator</label>
                    <Formula>{validator}</Formula>
                    <br/>
                </>
                )}

            <label className="control-label">Template</label>
            <Formula>{template}</Formula>
            

        </>
    )
}

const TemplateFormatConfigurationViewModel = ({ orderedFormatConfigurations }) => {
    return map(orderedFormatConfigurations, (formatConfiguration, idx) => (
        <div key={`tpl-format-conf-${idx}`} className="mb-3" style={{padding: '10px 10px', border: '1px solid #eee'}}>
            {formatConfiguration.discriminator === 'AmazonTemplateSpecificationViewModel' && <AmazonTemplateSpecificationViewModel {...formatConfiguration}/>}
            {formatConfiguration.discriminator === 'ValidableTemplateSpecificationViewModel' && <ValidableTemplateSpecificationViewModel {...formatConfiguration}/>}
        </div>
    ))

}

const SheetConfiguration = ({ businessRuleSetIds, 
    sheetIndex,
    dataStartingRow, 
    duplicateChildrenAfterParent, 
    hideAssortmentOnly, 
    hideNonAssortment,
    isChannelManaged,
}) => {
    return (
        <div style={{border: '1px solid #eee', padding: '10px 10px'}}>

            <div>
                Sheet index: {sheetIndex},
                Data starting row: {dataStartingRow},
                DuplicateChildrenAfterParent: {duplicateChildrenAfterParent ? 'y' : 'n'},
                HideAssortmentOnly: {hideAssortmentOnly ? 'y' : 'n'},
                HideNonAssortment: {hideNonAssortment ? 'y' : 'n'},
                IsChannelManaged: {isChannelManaged ? 'y' : 'n'},
            </div>


            {map(businessRuleSetIds, (businessRuleSetId, idx) => (
                <BusinessRuleSet key={`sheet-conf-brs-${businessRuleSetId}-${idx}`} id={businessRuleSetId} name={`sheet-conf-brs-${businessRuleSetId}-${idx}`}/>
            ))}
            <br/>
            
        </div>
    )
}

const ExcelFormatConfiguration = ({ businessRuleSetId, excelMappingConfiguration, fileLocation, sheetConfigurations }) => {
    return (
        <>
            <div><small>{fileLocation}</small></div>

            {businessRuleSetId && (
                <>
                    <label className="control-label">Business Rule Set</label>
                    <BusinessRuleSet id={businessRuleSetId} name={`sheet-conf-${businessRuleSetId}`}/>
                </>
                )}

            <>
                <label className="control-label">Excel mapping conf.</label>
                <Formula>{JSON.stringify(get(excelMappingConfiguration, 'orderedColumnMappings'), null, 2)}</Formula>
            </>

            <>
                <label className="control-label">Sheet conf.</label>
                {map(sheetConfigurations, (sheetConfiguration, idx) => (
                    <SheetConfiguration key={`sheet-conf-${idx}`} {...sheetConfiguration}/>
                ))}
            </>

        </>
    )
    
}

const ExcelFormatConfigurationViewModel = ({ highlightDifferences, isStandard, orderedFormatConfigurations }) => {
    return (
        <>
            <div>
                {highlightDifferences && <span className="badge badge-primary">Hightlight</span>}
                {isStandard && <span className="badge badge-secondary">Standard</span>}
                {map(orderedFormatConfigurations, (formatConfiguration, idx) => (
                    <ExcelFormatConfiguration key={`format-configuration-${idx}`} {...formatConfiguration}/>
                ))}
            </div>
        </>
    )

}

const FormatConfiguration = ({ discriminator, name, outputGroup, id, ...props }) => {
    return (
        <>
            <div className="mb-3">
                <Link target='_blank' to={`/tools/export-format/${id}`}>{name}</Link>
                {outputGroup && <span className="badge badge-primary float-right">Output group: {outputGroup}</span>}
            </div>
            {discriminator === 'TemplateFormatConfigurationViewModel' && <TemplateFormatConfigurationViewModel {...props}/>}
            {discriminator === 'ExcelFormatConfigurationViewModel' && <ExcelFormatConfigurationViewModel {...props}/>}
        </>
    )
}

const ExportFormatDetail = ({ formatConfigurationId }) => {
    const [ formatConfiguration, setFormatConfiguration ] = useState(null)

    useEffect(() => {
        getFormatById(formatConfigurationId).then(res => setFormatConfiguration(get(res, 'data')))
    }, [formatConfigurationId])

    if (formatConfiguration === null) return <>--</>

    return (
        <Card>
            <h3>Format</h3>
            <br/>

            <FormatConfiguration {...formatConfiguration}/>

        </Card>
    )

}

export default ExportFormatDetail
