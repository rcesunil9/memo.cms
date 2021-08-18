import React, { useMemo, useState, useEffect } from 'react'
import get from 'lodash/get'
import { withRouter, Link } from 'react-router-dom'
import { getActionById } from 'app/common/services/triggers'
import PageWrapper from 'app/common/components/layout/PageWrapper'
import BusinessRulesDetail from './BusinessRulesDetail'
import TransformationSetDetail from './TransformationSetDetail'
import ExportFormatDetail from './ExportFormatDetail'
import ExportTransportDetail from './ExportTransportDetail'
import FormatProcessingRejections from './FormatProcessingRejections'

const ExportPreComputedTradeItemActionDetail = ({
    match
}) => {
    const [action, setAction] = useState(null)
    const id = useMemo(() => match.params.id, [match.params.id])

    useEffect(() => {
        getActionById(id).then(res => setAction(get(res, 'data')))
    }, [id])

    if (action === null) return 'Loading...'

    return (
        <PageWrapper>

            <h2>{get(action, 'name')}</h2>
            <Link to={`/action/${id}`}>Go to configuration</Link>&nbsp;
            <Link to={`/actions`}>Go to actions list</Link>
            <br/><br/>

            <div className="row">
                <div className="col-6">
                    <BusinessRulesDetail rulesSetIds={action.businessRulesetIds}/>
                    <br/>
                    <ExportFormatDetail formatConfigurationId={action.formatConfigurationId}/>
                    <br/>
                    <ExportTransportDetail transportConfigurationId={action.transportConfigurationId}/>
                </div>

                <div className="col-6">
                    <TransformationSetDetail transformationSetId={action.transformationSetId}/>
                    <br/>
                    <FormatProcessingRejections exportActionId={id}/>
                </div>
            </div>

        </PageWrapper>
    )

}

export default withRouter(ExportPreComputedTradeItemActionDetail)
