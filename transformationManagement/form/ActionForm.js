import React from "react"
import { connect } from "react-redux"
import Select from "react-select"
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import get from "lodash/get"
import map from "lodash/map"
import isEmpty from "lodash/isEmpty"
import dotProp from "dot-prop-immutable"
import * as utils from "../utils"
import * as actions from "../actions/edit"
import * as selectors from "../selectors/edit"
import ParamFactory from "../../common/components/parameters"
import Editor from "../../common/components/editor/Editor";
import Modal from "../../common/components/layout/Modal";

class ActionForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showFullscreen: false
        }
    }

    toggleFullscreen() {
        this.setState(dotProp.set(this.state, "showFullscreen", !this.state.showFullscreen))
    }

    render() {

        const {
            action,
            actionsDefinitions,
            actionDefinition,
            isActionAddMode,
            tradeItemProperties,
            tradeItemPropertySelected,
            areTradeItemPropertiesLoading,
        } = this.props

        const {
            addAction,
            updateAction,
            resetEditAction,
            changeAction,
            updateActionSet,
            editActionKey,
        } = this.props

        const { showFullscreen } = this.state


        return (
            <React.Fragment>
                
                <div className="row">
                    <div className="col mb-3">
                        <div className="custom-control custom-radio">
                            <input 
                                onChange={e => {
                                    console.log(e.target.value)
                                    changeAction(dotProp.set(action, "actionExecutionCondition", "None"))
                                }}
                                checked={utils.isActionExecutionConditionNone(action)}
                                type="radio" 
                                id="action-execution-condition-none" 
                                className="custom-control-input" />
                            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="action-execution-condition-none">None</label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input 
                                onChange={e => {
                                    console.log(e.target.value)
                                    changeAction(dotProp.set(action, "actionExecutionCondition", "IfCurrentValueIsNull"))
                                }}
                                checked={utils.isActionExecutionConditionCurrentValueNull(action)}
                                type="radio" 
                                id="action-execution-condition-current-value-null" 
                                className="custom-control-input" />
                            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="action-execution-condition-current-value-null">If current value is Null</label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input 
                                onChange={e => {
                                    console.log(e.target.value)
                                    changeAction(dotProp.set(action, "actionExecutionCondition", "IfCurrentValueIsNotNull"))
                                }}
                                checked={utils.isActionExecutionConditionCurrentValueNotNull(action)}
                                type="radio" 
                                id="action-execution-condition-current-value-not-null" 
                                className="custom-control-input" />
                            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="action-execution-condition-current-value-not-null">If current value is not null</label>
                        </div>
                    </div>
                </div>

                {/* Built-in */}
                <div className="row">
                    <div className="col mb-3">
                        <div className="custom-control custom-radio">
                            <input 
                                onChange={e => changeAction(utils.getDefaultBuiltInAction())}
                                checked={utils.isBuiltInAction(action)}
                                type="radio" 
                                id="built-in-trans" 
                                className="custom-control-input" />
                            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="built-in-trans">Built-in actions</label>
                        </div>
                    </div>
                </div>
                {/* Built-in values */}
                {utils.isBuiltInAction(action) && <div className="row mb-3">
                    {/* Select transformation */}
                    <div className="col-12">     
                      {/* Initial property */}
                      <div className="form-group">
                        <label>Initial property *:</label>
                        <Select 
                          isLoading={areTradeItemPropertiesLoading}
                          getOptionLabel={b => b.code}
                          getOptionValue={b => b.id}
                          options={tradeItemProperties}
                          onChange={b => updateActionSet("actionSet.sourcePropertyCode", b.code)}
                          value={tradeItemPropertySelected} />
                      </div>
                        <div className="form-group">
                            <label>Transformation *:</label>
                            <Select 
                                getOptionLabel={b => b.name}
                                getOptionValue={b => b.id}
                                options={actionsDefinitions}
                                onChange={d => {
                                    changeAction(dotProp.set(dotProp.set(action, "parameterValues", []), "builtInActionDefinitionId", d.id))
                                }}
                                value={actionDefinition} />
                        </div>
                        {/* Parameters */}
                        {!isEmpty(actionDefinition) && get(actionDefinition, "parametersDefinition", null) && <div className="form-group">
                            {map(actionDefinition.parametersDefinition, (parameter, pIndex) => <div key={`editing-param-${pIndex}`}>
                            
                                <ParamFactory
                                    type={get(parameter, "parameterType")}
                                    name={get(parameter, "code")}
                                    isMandatory={get(parameter, "isMandatory")}
                                    value={get(action, `parameterValues.${pIndex}.value`, null)}
                                    onChange={paramValue => changeAction(dotProp.set(action, `parameterValues.${pIndex}`, {parameterCode: parameter.code, value: paramValue}))}
                                    />
                            
                            </div>)}
                        </div>}
                    </div>
                </div>}
        
                {/* Template */}
                <div className="row pt-4">
                    <div className="col mb-3">
                        <div className="custom-control custom-radio">
                            <input 
                                onChange={e => changeAction(utils.getDefaultTemplateAction())}
                                checked={utils.isTemplateAction(action)}
                                type="radio" 
                                id="template-trans" 
                                className="custom-control-input" />
                            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="template-trans">Template</label>
                        </div>
                    </div>
                </div>
                {/* Template values */}
                {utils.isTemplateAction(action) && <div className="row mb-3">
                    {/* Template text area */}
                    <div className="col-12 d-block" style={{zIndex: 0}}>
                        <span>Input : tradeItemViewModel, currentValue, context</span>
                        <Editor
                            type={"CSHARP"}
                            value={action.template}
                            onChange={val => editActionKey("template", val)} 
                            />
                        <button 
                            onClick={e => this.toggleFullscreen()}
                            className="btn btn-primary mt-2"
                            >Show fullscreen</button>

                        {showFullscreen && <Modal title="Edit action template" size="lg" onClose={() => this.toggleFullscreen()}>
                            <Editor
                                height="auto"
                                type={"CSHARP"}
                                value={get(action, "template", "")}
                                onChange={val => editActionKey("template", val)} 
                                />
                            <button
                                className="btn btn-primary mt-3 float-right"
                                onClick={() => this.toggleFullscreen()}
                                >Ok</button>
                        </Modal>}
                    </div>
                </div>}
                {/* Add */}
                <div className="row mb-3">
                    <div className="col text-right">
                        <button className="btn btn-light mr-2" onClick={e => resetEditAction()}>Cancel</button>
                        <button className="btn btn-secondary" onClick={e => isActionAddMode ? addAction(action) : updateAction(action)}>Ok</button>
                    </div>
                </div>
        
        
            </React.Fragment>
        )

    }

}


const mapStateToProps = (state) => {
    return {
        action: selectors.action(state),
        actionsDefinitions: selectors.getActionsDefinitionsOrdered(state),
        actionDefinition: selectors.getActionDefinition(state),
        isActionAddMode: selectors.isActionAddMode(state),
        tradeItemProperties: selectors.getTradeItemPropertiesOrdered(state),
        tradeItemPropertySelected: selectors.getTradeItemPropertySelected(state),
        areTradeItemPropertiesLoading: selectors.areTradeItemPropertiesLoading(state),
    }
}

export default connect(mapStateToProps, actions)(ActionForm)