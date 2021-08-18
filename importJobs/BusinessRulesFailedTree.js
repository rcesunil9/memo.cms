import React from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'


const BusinessRuleNode = ({
    name,
    success,
    businessRuleId
}) => (

    <div
        className={success ? 'text-success' : 'text-danger'}
        >

        { name }

    </div>
)

class BusinessRuleSetNode extends React.Component {

    state = {
        rootKey: `${get(this, 'props.rootKey', '')}.brn`,
        opened: false
    }

    toggle() {
        this.setState({ opened: !this.state.opened })
    }

    render() {

        const { opened, rootKey } = this.state

        const { businessRuleSet } = this.props

        if(!businessRuleSet || isEmpty(businessRuleSet)) return <div/>

        return (

            <div style={{ padding: '.5em', marginTop: '.5em', backgroundColor: 'rgba(0,0,0,.02)', borderLeft: '1px solid rgba(0,0,0,.04)' }}>

                {/* BRS name */}
                <div
                    onClick={e => this.toggle()}
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                    className={get(businessRuleSet, 'success', false) ? 'text-success' : 'text-danger'}
                    >

                    {opened ? 'v' : '>'} {get(businessRuleSet, 'name', null)}

                </div>

                {opened && <div style={{ paddingLeft: "1.5em" }}>

                    {/* Simple business rules first */}
                    {map(get(businessRuleSet, 'businessRuleEvaluationResults', []), (businessRule, businessRuleKey) => <BusinessRuleNode key={`${rootKey}.br.${businessRuleKey}`} {...businessRule}/> )}

                    {/* Business rules sets (recursive) */}
                    {map(get(businessRuleSet, 'businessRuleSetEvaluationResults', []), (businessRuleSet, businessRuleSetKey) => (
                        <BusinessRuleSetNode
                            key={`${rootKey}.brs.${businessRuleSetKey}`}
                            rootKey={`${rootKey}.brs.${businessRuleSetKey}`}
                            businessRuleSet={businessRuleSet}
                            />
                        ))}

                </div>}

            </div>
        )

    }

}


class BusinessRulesEvaluationResult extends React.Component {

    render() {

        const { evaluationResult } = this.props

        return (

            <React.Fragment>
                
                <BusinessRuleSetNode 
                    rootKey='evaluation-result-'
                    businessRuleSet={evaluationResult}
                    />

            </React.Fragment>

        )

    }

}

export default BusinessRulesEvaluationResult
