import React from "react"
import update from "immutability-helper"
import { Link } from 'react-router-dom'
import filter from "lodash/filter"
import find from "lodash/find"
import map from "lodash/map"
import get from "lodash/get"
import uniq from "lodash/uniq"
import findIndex from "lodash/findIndex"

import Select from "react-select"
import dotProp from 'dot-prop-immutable'
import SelectString from "../common/components/form/SelectString"
import Card from "../common/components/layout/Card"
import getModelForm from "./triggerForm/index"
import { inputChanger, triggerDiscriminators, getActivationPeriodPlaceholder } from "./utils"
import ParamFactory from '../common/components/parameters'

const TriggerForm = ({ trigger, actions, exportActions, triggerInputParams, setTriggerInputParameter, onChange, onSave }) => {

  const addPeriod = () => onChange(update(trigger, {activationPeriods: {$push: [getActivationPeriodPlaceholder()]}}))
  const removePeriod = (index) => onChange(update(trigger, {activationPeriods: {$set: [...trigger.activationPeriods.slice(0, index), ...trigger.activationPeriods.slice(index + 1)]}}))
  const changePeriod = (index, key, value) => onChange(update(trigger, {activationPeriods: {[index] : {[key] : {rawValue: {$set: value}}}}}))

  const change = inputChanger(trigger, onChange)
  const Model = getModelForm(trigger.discriminator)
  const save = e => {
    e.preventDefault()
    onSave()
  }
  return (
    <form onSubmit={save}>
      <div className="row no-gutters">
        <div className="col">
          {/* Name */}
          <div className="form-group">
            <label className="control-label">Name*</label>
            <input
              className="form-control"
              name="name"
              value={trigger.name}
              onChange={change}
              required
            />
          </div>

          {/* Discriminator */}
          <div className="form-group">
            <label className="control-label">Discriminator*</label>
            <SelectString
              options={triggerDiscriminators()}
              value={trigger.discriminator}
              onChange={val => onChange(update(trigger, { discriminator: { $set: val } }))}
            />
          </div>

          {/* Activation period */}
          <Model model={trigger} exportActions={exportActions} onChange={onChange}/>
          <div className="form-group">
            <label className="control-label">Activation periods</label>
            <div className="mb-2">
              <button className="btn btn-secondary" type="button" onClick={addPeriod}>
                + Add new period
              </button>
            </div>
            <div className="form-row">
              <div className="form-group col-5 mb-1">
                <label>Period start</label>
              </div>
              <div className="form-group col-5 mb-1">
                <label>Period end</label>
              </div>
              <div className="form-group col-2 mb-1">
              </div>
            </div>
            {map(get(trigger, 'activationPeriods'), (period, index) => {
              return <div className="form-row" key={`period-${index}`}>
                <div className="form-group col-5">
                  <input
                    className="form-control"
                    name="periodStart"
                    value={get(period, 'periodStart.rawValue')}
                    onChange={e => changePeriod(index, 'periodStart', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-5">
                  <input
                    className="form-control"
                    name="periodEnd"
                    value={get(period, 'periodEnd.rawValue')}
                    onChange={e => changePeriod(index, 'periodEnd', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-2 text-right">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removePeriod(index)
                    }}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="col">
          <ActionsSection {...{ trigger, actions, triggerInputParams, setTriggerInputParameter, onChange }} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="form-group row">
        <div className="col" />
        <div className="col d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

const actionCardStyle = {
  backgroundColor: "#dcdfe1",
  borderColor: "#cfd2d5",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "8px",
}

const ActionCard = ({action, actionId, actionParameters, index, triggerInputParams, onRemove, setTriggerInputParameter, onChange}) => {

  if (!action) return null
  const {name} = action
  const actionParameter = find(actionParameters, ['actionId', actionId])
  const findParameterIndex = (param) => findIndex(get(actionParameter, 'actionParameterList'), ['parameterCode', param])

  const change = (k, v) => findParameterIndex(k) !== -1 ?
    onChange(`actionParameters.${index}`, update(actionParameter, {actionParameterList: {[findParameterIndex(k)]: {value: {$set: v}}}})) :
    onChange(`actionParameters.${index}`, update(actionParameter, {
      actionParameterList: {
        $push: [{
          parameterCode: k,
          value: v
        }]
      }
    }))

  return (
    <React.Fragment>
      <div style={actionCardStyle}>
        <Link to={`/action/${actionId}`} className="col-6">{name}</Link>
        <div className="col-6 text-right">
          <button className="btn btn-default" type="button" onClick={() => onRemove(action)}>
            Remove
          </button>
        </div>

        <div className="col-12">
          <button className="btn btn-link p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    if (get(triggerInputParams, 'id') === action.id) {
                      setTriggerInputParameter(null)
                    } else setTriggerInputParameter(action)
                  }}>
            {get(triggerInputParams, 'id') === action.id ?
              <span>Hide parameters: <i className="icon-arrow-up"/></span> :
              <span>Show parameters: <i className="icon-arrow-down"/></span>
            }
          </button>
        </div>

        {get(triggerInputParams, 'id') === actionId &&
        <div className="form-row bg-light mt-2">
          {map(get(action, 'inputParameters'), (inputParam, inputParamKey) => (
            <div
              key={`input-param-${inputParamKey}`}
              className="col-6 p-3"
              //To prevent container to collapse when form fields focused
              onClick={(e) => e.stopPropagation()}
            >
              <ParamFactory
                type={inputParam.type}
                name={inputParam.code}
                isArray={inputParam.isArray}
                value={get(find(get(actionParameter, 'actionParameterList'), ['parameterCode', inputParam.code]), 'value', null)}
                onChange={value => change(inputParam.code, value)}
              />
            </div>
          ))}
        </div>
        }
      </div>
    </React.Fragment>
  )
}

const ActionsSection = ({ trigger, actions, triggerInputParams, setTriggerInputParameter, onChange }) => {

  const removeAction = id => {
    const actions = trigger.actions.filter(i => i !== id)
    const actionParameters = trigger.actionParameters.filter(i => i.actionId !== id)
    onChange(update(trigger, { actions: { $set: actions }, actionParameters: {$set: actionParameters} }))
  }

  const addAction = id => {
    const actions = [...trigger.actions, id]
    const actionParameters = [...trigger.actionParameters, {actionId: id, actionParameterList: []}]
    onChange(update(trigger, { actions: { $set: actions }, actionParameters: { $set: actionParameters } }))
  }

  const change = (k, v) => onChange(dotProp.set(trigger, k, v))

  const makeOptions = list => map(list, obj => ({ label: obj.name, value: obj.id }))
  const actionOptions = makeOptions(filter(actions, a => trigger.actions.indexOf(a.id) < 0))

  return (
    <Card>
      <h3>Actions</h3>

      <div className="form-group">
        <label className="control-label">Add an action to the trigger</label>
        <Select options={actionOptions} value={null} onChange={option => addAction(option.value)} />
      </div>

      <h4>Actions added</h4>
      {uniq(trigger.actions).map((actionId, index) => {
        return <ActionCard
          key={actionId}
          index={index}
          actionId={actionId}
          actionParameters={trigger.actionParameters}
          onChange={change}
          triggerInputParams={triggerInputParams}
          setTriggerInputParameter={setTriggerInputParameter}
          action={find(actions, ["id", actionId])}
          onRemove={action => removeAction(action.id)}
        />
      })}
    </Card>
  )
}

export default TriggerForm
