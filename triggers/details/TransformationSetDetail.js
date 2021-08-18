import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import Card from 'app/common/components/layout/Card'
import { getTransformationSet, getActionDefinition } from 'app/common/services/transformationManagement'
import { BusinessRuleSet } from './BusinessRulesDetail'
import { Formula } from 'app/common/components/formula/Formula'

const TemplateActionViewModel = ({ template }) => {
    return (
        <Formula>{template}</Formula>
    )
}

const BuiltInActionViewModel = ({ builtInActionDefinitionId, parameterValues }) => {
    const [ actionDefinition, setActionDefinition ] = useState(null)
    
    useEffect(() => {
        getActionDefinition(builtInActionDefinitionId).then(res => setActionDefinition(get(res, 'data')))
    }, [builtInActionDefinitionId])

    return (
        <div style={{paddingLeft: '10px'}}>
          <i>{get(actionDefinition, 'name')}:&nbsp;</i>
          {map(parameterValues, v => `${v.parameterCode}: ${v.value}`).join(', ')}
        </div>
    )
}

const ParametrizedAction = ({ parametrizedAction }) => {
    return (
        <div style={{paddingLeft: "10px", borderLeft: "1px solid #eee"}}>
            {get(parametrizedAction, 'discriminator')}
            {get(parametrizedAction, 'discriminator') === 'TemplateActionViewModel' && <TemplateActionViewModel {...parametrizedAction}/>}
            {get(parametrizedAction, 'discriminator') === 'BuiltInActionViewModel' && <BuiltInActionViewModel {...parametrizedAction}/>}
        </div>
    )

}

const ConditionnalActionSet = ({ conditionalActionSet, name }) => {
    return (
        <div style={{border: '1px solid #eee', padding: '10px', marginBottom: '10px'}}>
            {get(conditionalActionSet, 'actionSet.name')} 
            <span className="float-right">
                <span className="badge badge-primary">{get(conditionalActionSet, 'actionSet.propertyGroup')}</span>
                {get(conditionalActionSet, 'actionSet.sourcePropertyCode') && <span className="badge badge-secondary">src prop.: {get(conditionalActionSet, 'actionSet.sourcePropertyCode')}</span>}
                {get(conditionalActionSet, 'businessRuleSetId') && <BusinessRuleSet id={conditionalActionSet.businessRuleSetId} name={`conditional-${name}-${conditionalActionSet.businessRuleSetId}`}/>}
            </span>
            {map(get(conditionalActionSet, 'actionSet.orderedParametrizedActions'), (parametrizedAction, idx) => (
                <ParametrizedAction parametrizedAction={parametrizedAction} key={`parametrized-${get(conditionalActionSet, 'actionSet.name')}-${idx}`}/>
            ))}
        </div>
    )

}

const Transformation = ({ transformation, isExpanded, onClick }) => {

    if (!isExpanded) return <div onClick={onClick}>{transformation.name}</div>

    return (
        <>
            <div className="font-weight-bold" onClick={onClick}>{transformation.name}</div>
            <div>
                {map(transformation.orderedConditionalActionSets, (actionSet, idx) => (
                    <ConditionnalActionSet key={`transformation-${transformation.name}-${actionSet.name}-${idx}`} conditionalActionSet={actionSet} name={`transformation-${transformation.name}-${actionSet.name}-${idx}`}/>
                ))}
            </div>
        </>
    )

}

const TransformationSetDetail = ({
    transformationSetId
}) => {
    const [ transformationSet, setTransformationSet ] = useState(null)
    const [ expandedIndex, setExpandedIndex ] = useState(-1)
    
    useEffect(() => {
        getTransformationSet(transformationSetId).then(res => setTransformationSet(get(res, 'data')))
    }, [ transformationSetId ])

    const orderedTransformations = useMemo(() => sortBy(get(transformationSet, 'transformations'), 'name'), [ transformationSet ])

    if (transformationSet === null) return <>--</>

    return (
        <Card>
            <h3>Transformations</h3>
            <br/>

            <Link target='_blank' to={`/tools/export-transformation/${transformationSetId}`}>{transformationSet.name}</Link>
            <br/><br/>

            {map(orderedTransformations, (transformation, idx) => (
                <div className="row" key={`transformation-${transformation.name}-${idx}`}>
                    <div className="col">
                        {expandedIndex === idx ? 'v' : '>'}
                    </div>
                    <div className="col-11" style={{cursor: 'pointer'}}>
                        <Transformation 
                            transformation={transformation} 
                            isExpanded={expandedIndex === idx}
                            onClick={e => expandedIndex === idx ? setExpandedIndex(-1) : setExpandedIndex(idx)}
                            />
                    </div>
                </div>
            ))}
        </Card>
    )
}

export default TransformationSetDetail
