import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import Card from 'app/common/components/layout/Card'
import { getBusinessRuleSetById, getBusinessRuleById } from 'app/common/services/businessRules'
import Loader from 'app/common/components/loaders/Loader'
import { Formula } from 'app/common/components/formula/Formula'

const formulaPartsRegex = /([{[]\s*[^}\]\s]+\s*[}\]])/gm
const innerFormulaPartsRegex = /[{[]\s*([^}\]\s]+)\s*[}\]]/gm
const brsformulaHoverableStyle = {
    color: '#eceba5',
    cursor: 'pointer',
    textDecoration: 'underline'
}
const brWrapperStyle = {
    position: 'relative',
    paddingLeft: '28px'
}
const brBadgeStyle = {
    position: 'absolute',
    fontSize: '.5rem',
    left: '2px',
    bottom: '2px',
    padding: '1px 5px',
    borderRadius: '6px'

}
const brInnerBrsStyle = {
    position: 'fixed',
    left: '50px',
    width: '500px',
    padding: '20px',
    borderRadius: '6px',
    height: 'auto',
    minHeight: '2rem',
    color: '#444',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    zIndex: 8001,
    background: '#fff'
}
const closeStyle = {
    position: 'absolute',
    right: '0',
    top: '0',
    width: '20px',
    height: '20px',
    borderTopRightRadius: '6px',
    color: '#fff',
    background: 'red',
    textAlign: 'center'
}

const BusinessRule = ({ id, customPosition }) => {
    const [businessRule, setBusinessRule] = useState(null)
    const [opened, setOpened] = useState(false)
    const [position, setPosition] = useState(null)
    const targetRef = useRef(null)

    const memoizedShortDesc = useMemo(() => get(businessRule, 'shortDescription.values[0].value'), [businessRule])
    const memoizedDesc = useMemo(() => get(businessRule, 'description.values[0].value'), [businessRule])

    useEffect(() => {
        getBusinessRuleById(id).then(res => setBusinessRule(get(res, 'data')))
    }, [id])

    useEffect(() => {
        if (!opened) {
            setPosition(null)
            return
        }
        const { top, right, bottom, left, width, height, x, y } = targetRef.current.getBoundingClientRect()
        setPosition({...{top, right, bottom, left, width, height, x, y}, ...(customPosition || {})})
    }, [opened, targetRef, customPosition])

    if (businessRule === null) return '--'

    return (
        <span style={brWrapperStyle}>
            <span ref={targetRef} onClick={e => setOpened(o => !o)}>{businessRule.name}</span>
            <span className='badge badge-secondary' style={brBadgeStyle}>BR</span>
            {opened && position && (
                <div style={{...brInnerBrsStyle, top: get(position, 'top') + 20, left: get(position, 'left')}}>
                    <div onClick={e => setOpened(false)} style={closeStyle}>X</div>
                    <div>{memoizedShortDesc}</div>
                    <div>{memoizedDesc}</div>
                    <div>Property group: <strong>{businessRule.propertyGroup}</strong>, Property name: <strong>{businessRule.propertyName}</strong></div>
                    <br/>
                    <Formula>{businessRule.formula}</Formula>
                </div>
            )}
        </span>
    )
}

const BusinessRuleSetElement = ({ id, name, customPosition }) => {
    const [businessRuleSet, setBusinessRuleSet] = useState(null)
    const [opened, setOpened] = useState(false)
    const [position, setPosition] = useState(null)
    const targetRef = useRef(null);

    useEffect(() => {
        getBusinessRuleSetById(id).then(res => setBusinessRuleSet(get(res, 'data')))
    }, [id])

    useEffect(() => {
        if (!opened) {
            setPosition(null)
            return
        }
        const { top, right, bottom, left, width, height, x, y } = targetRef.current.getBoundingClientRect()
        setPosition({...{top, right, bottom, left, width, height, x, y}, ...(customPosition || {})})
    }, [opened, targetRef, customPosition])

    if (businessRuleSet === null) return '--'

    return (
        <span style={brWrapperStyle}>
            <span ref={targetRef} onClick={e => setOpened(o => !o)}>{businessRuleSet.name}</span>
            <span className='badge badge-secondary' style={brBadgeStyle}>BRS</span>
            {opened && position && (
                <div style={{...brInnerBrsStyle, top: get(position, 'top') + 20, left: get(position, 'left')}}>
                    <div onClick={e => setOpened(false)} style={closeStyle}>X</div>
                    <BusinessRuleSet id={id} name={name}/>
                </div>
            )}
        </span>
    )
}

function BusinessRuleSet({ id, name, customPosition }) {
    const [ businessRuleSet, setBusinessRuleSet ] = useState(null)

    useEffect(() => {
        getBusinessRuleSetById(id).then(res => setBusinessRuleSet(get(res, 'data')))
    }, [ id ])

    const memoizedShortDesc = useMemo(() => get(businessRuleSet, 'shortDescription.values[0].value'), [businessRuleSet])
    const memoizedDesc = useMemo(() => get(businessRuleSet, 'description.values[0].value'), [businessRuleSet])
    const areDescEqual = useMemo(() => memoizedShortDesc === memoizedDesc, [memoizedShortDesc, memoizedDesc])

    const getParsedFormula = useCallback(() => {
        if (businessRuleSet === null) return 'building...'
        if (!get(businessRuleSet, 'userFriendlyFormula')) return 'no formula.'

        const regexF = new RegExp(formulaPartsRegex)
        const userFriendlyFormula = get(businessRuleSet, 'userFriendlyFormula')
        const formula = get(businessRuleSet, 'formula')
        const userFriendlyFormulaParts = userFriendlyFormula.split(regexF)
        const formulaParts = formula.split(innerFormulaPartsRegex)
        const parsedFormula = []
        map(userFriendlyFormulaParts, (part, partIdx) => {
            const k = `${name || 'MISSING_NAME'}-${partIdx}`
            if (part !== undefined) {
                if (part.match(regexF)) {
                    const id = formulaParts[partIdx]
                    if (part[0] === '{') parsedFormula.push(<span style={brsformulaHoverableStyle} key={k}><BusinessRule id={id} name={`inner-br-${k}`} customPosition={customPosition}/></span>)
                    else parsedFormula.push(<span style={brsformulaHoverableStyle} key={k}><BusinessRuleSetElement id={id} name={`inner-br-${k}`} customPosition={customPosition}/></span>)
                } else parsedFormula.push(<span key={k}>{part}</span>)
            }
        })

        return parsedFormula

    }, [businessRuleSet, name, customPosition])

    if (businessRuleSet === null) return <Loader />;

    return (
        <>
            <p className="bold mb-0">
                {get(businessRuleSet, 'name')}
                <span className="badge badge-secondary float-right">
                    <small>{get(businessRuleSet, 'businessRuleSetType')}</small>
                </span>
                <span className="badge badge-light float-right">
                    <small>{get(businessRuleSet, 'propertyScope')} - </small>
                    <small>{get(businessRuleSet, 'propertyGroup')}</small>
                </span>
            </p>
            <small>{memoizedShortDesc}</small>
            <br/>
            {!areDescEqual && <small>{memoizedDesc}</small>}
            <Formula>{getParsedFormula()}</Formula>
        </>
    )    
}

const BusinessRulesDetail = ({
    rulesSetIds
}) => {
    if (isEmpty(rulesSetIds)) return <>--</>

    return (
        <Card>
            <h3>Business rules</h3>
            <br/>

            {map(rulesSetIds, (id, idx) => (
                <div className="row mb-3" key={`business-rule-${id}-${idx}`}>
                    <div className="col">
                        {idx+1}.)
                    </div>
                    <div className="col-11">
                        <BusinessRuleSet id={id} name={`business-rule-det-${id}-${idx}`}/>
                    </div>
                </div>
            ))}
        </Card>
    )
}


export { BusinessRuleSet }
export default BusinessRulesDetail
