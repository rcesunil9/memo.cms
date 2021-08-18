import React, { useEffect, useState, useMemo, useCallback } from "react"
import Sticky from 'react-stickynode'
import { ExportProgressBarFetch } from "./ExportProgressBar"
import { Link } from 'react-router-dom'
import get from "lodash/get"
import map from "lodash/map"
import isEmpty from "lodash/isEmpty"
import PageWrapper from "app/common/components/layout/PageWrapper"
import { getEvaluationDetails } from "app/common/services/businessRules"
import Card from "app/common/components/layout/Card"
import { BusinessRuleSet } from "app/triggers/details/BusinessRulesDetail"
import { getActionById } from "app/common/services/triggers"
// import WindowedMasonry from 'app/common/components/virtualized/WindowedMasonry2'
import VirtualizedList from 'app/common/components/virtualized/VirtualizedList'


const CUSTOM_POSITION = {
    top: 400,
    left: 20
}

const BusinessRuleSetEvaluationResultLight = ({ evaluationResult, onShowDetail }) => {
    return (
        <>
            <div>
                <span className={`mr-3 badge badge-${evaluationResult.success ? 'success' : 'danger'}`}>{evaluationResult.success ? 'Success' : 'Failure'}</span>
                &nbsp;
                <strong>{evaluationResult.name}</strong>
                <button className='btn btn-sm btn-light d-inline-block ml-4' onClick={onShowDetail}>Details</button>
                { evaluationResult.tradeItemId !== "00000000-0000-0000-0000-000000000000" && <Link target="blank" to={`/trade-item/${evaluationResult.tradeItemId}`} className="btn btn-sm btn-light ml-2">View product</Link> }
            </div>
        </>
    )
}

const BusinessRuleSetEvaluationResult = ({ evaluationResult, name }) => {
    const [ showDetail, setShowDetail ] = useState(false)

    const hasDescendants = useMemo(() => !isEmpty(evaluationResult.businessRuleEvaluationResults) || !isEmpty(evaluationResult.businessRuleSetEvaluationResults), [evaluationResult])

    return (
        <>
            <div>
                <span className={`mr-3 badge badge-${evaluationResult.success ? 'success' : 'danger'}`}>{evaluationResult.success ? 'Success' : 'Failure'}</span>
                &nbsp;
                <strong>{evaluationResult.name}</strong>
                <button className='btn btn-sm btn-light d-inline-block ml-4' onClick={e => setShowDetail(v => !v)}>Toggle brs detail</button>
                { evaluationResult.tradeItemId !== "00000000-0000-0000-0000-000000000000" && <Link target="blank" to={`/trade-item/${evaluationResult.tradeItemId}`} className="btn btn-sm btn-light ml-2">View product</Link> }
            </div>
            {showDetail && <BusinessRuleSet id={evaluationResult.businessRuleSetId} customPosition={CUSTOM_POSITION}/>}

            {hasDescendants && (
                <div className="p-2 pl-3 mt-3" style={{ backgroundColor: 'rgba(0,0,0,.02)', borderLeft: '1px solid rgba(0,0,0,.05)' }}>
                    {map(evaluationResult.businessRuleEvaluationResults, (evr, idx) => <EvaluationResult key={`${name}-${idx}`} evaluationResult={evr} name={`${name}-${idx}`}/>)}                
                    {map(evaluationResult.businessRuleSetEvaluationResults, (evr, idx) => <EvaluationResult key={`${name}-${idx}`} evaluationResult={evr} name={`${name}-${idx}`}/>)}                
                    </div>)}
        </>
    )
}

const BusinessRuleEvaluationResult = ({ evaluationResult }) => {
    return (
        <>
            <div>
                <span className={`mr-3 badge badge-${evaluationResult.success ? 'success' : 'danger'}`}>{evaluationResult.success ? 'Success' : 'Failure'}</span>
                &nbsp;
                <strong>{evaluationResult.name}</strong>
            </div>
        </>
    )
}

export function EvaluationResult({ evaluationResult, name }) {
    return evaluationResult.businessRuleSetId 
            ? <BusinessRuleSetEvaluationResult evaluationResult={evaluationResult} name={name}/>
            : <BusinessRuleEvaluationResult evaluationResult={evaluationResult} name={name}/>
    }

const ExportJobDetails = ({ id, exportPreComputedTradeItemActionId }) => {
    const [ evaluationResults, setEvaluationResults] = useState([])
    const [ exportAction, setExportAction ] = useState(null)
    const [ evaluationResultSelectedIndex, setEvaluationResultSelectedIndex] = useState(-1)

    useEffect(() => {
        getEvaluationDetails(id).then(res => setEvaluationResults(get(res, 'data.evaluationResult')))

        if (exportPreComputedTradeItemActionId) getActionById(exportPreComputedTradeItemActionId).then(res => setExportAction(get(res, 'data')))

    }, [id, exportPreComputedTradeItemActionId])

    const cellRenderer = useCallback(({index, isScrolling, key, parent, style}) => {
        return (
            <div
                style={style}
                className='col-12'
                key={`import-job-detail-${key}`}
                >
                <BusinessRuleSetEvaluationResultLight evaluationResult={evaluationResults[index]} onShowDetail={() => setEvaluationResultSelectedIndex(index)}/>
                </div>
        )
    }, [evaluationResults])

    return (
        <PageWrapper>

            <h1>Pre computing job detail</h1>

            <h4 className="mb-4">
                <span>{ get(exportAction, "name") }</span>
                <span className="float-right">
                    <ExportProgressBarFetch jobId={id} style={{ minWidth: '300px' }} showFigure={true}/>
                </span>
            </h4>

            <Link to={`/tools/export-jobs`} className='btn btn-light btn-sm'>Back to list</Link>&nbsp;   
            <Link className='btn btn-secondary btn-sm' to={`/action-precomputing-detail/${exportPreComputedTradeItemActionId}`} target='_blank'>Go to action detail</Link>
            <br/><br/>

            {/* Evaluation */}
            <div className='row'>
                <div className='col-6'>
                    <Card>
                        <h5 className='mb-4'>Evaluation results</h5>
                        <VirtualizedList
                            list={evaluationResults}
                            overscanRowCount={2}
                            rowRenderer={cellRenderer}
                            />
                    </Card>
                </div>
                <div className='col-6'>
                    <Sticky top={70} innerZ={0}>
                        <Card>
                            <h5 className='mb-4'>Detail</h5>
                            {evaluationResultSelectedIndex > -1 && <EvaluationResult evaluationResult={evaluationResults[evaluationResultSelectedIndex]} name={`selected-eval-${evaluationResultSelectedIndex}`}/>}
                        </Card>
                    </Sticky>
                </div>
            </div>
        </PageWrapper>
    )
}


const ExportJobDetailsRouted = ({
    match
}) => {
    return <ExportJobDetails id={match.params.id} exportPreComputedTradeItemActionId={match.params.exportPreComputedTradeItemActionId}/> 
}

export { ExportJobDetails }

export default ExportJobDetailsRouted