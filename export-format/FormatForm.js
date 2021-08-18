import React from "react"
import update from "immutability-helper"
import { Link } from 'react-router-dom'
import find from "lodash/find"
import get from "lodash/get"
import map from "lodash/map"
import Select from "react-select"
import SelectString from "../common/components/form/SelectString"
import Card from "../common/components/layout/Card"
import OrderedFormatConfigurations from "./OrderedFormatConfigurations"
import { formatTypes, inputChanger, getGroupsOutputBy } from "./utils"
import JSONTemplateValidation from "./forms/JSONTemplateValidation";

const types = formatTypes()


class FormatForm extends React.Component {

  componentDidMount() {
    const { loadProperties } = this.props
    loadProperties()
  }

  render() {
    const {
      format,
      onChange,
      onSave,
      tradeItemCategories,
      taxonomies,
      businessRules,
      businessRulesets,
      propertyGroups,
      transformationSets,
      loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId,
      loadProperties
    } = this.props
  
    const save = e => {
      e.preventDefault()
      onSave()
    }
  
    const change = (k, v) => onChange(update(format, { [k]: { $set: v } }))
    const onInput = inputChanger(format, onChange)
  
    return (
      <form onSubmit={save}>
        <div className="row">
          <div className="col-3">
            <Card>
              {/* Name */}
              <div className="form-group">
                <label className="control-label">Name*</label>
                <input
                  className="form-control"
                  name="name"
                  value={format.name}
                  onChange={onInput}
                  required
                />
              </div>
  
              {/* Type */}
              <div className="form-group">
                <label className="control-label">Type*</label>
                <SelectString
                  options={map(types, "name")}
                  value={get(find(types, ["discriminator", format.discriminator]), "name")}
                  onChange={name => {
                    window.confirm(`Are you sure unsaved configuration data will disappear?`)  && onChange(update(format, {
                        discriminator: { $set: get(find(types, ["name", name]), "discriminator")},
                        orderedFormatConfigurations: { $set: []}
                      }))
                    loadProperties()
                  }}
                />
              </div>
  
              {/* Taxonomy */}
              <div className="form-group">
                <label className="control-label">Taxonomy*</label>
                <Select
                  options={taxonomies}
                  value={find(taxonomies, s => s.id === get(format, "taxonomyId", null)) || null}
                  name={"taxonomyId"}
                  getOptionLabel={o => o.name}
                  getOptionValue={o => o.id}
                  onChange={s => {
                    loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId(s.id, get(format, "tradeItemCategory.code", null))
                    change("taxonomyId", s.id)
                    loadProperties()
                  }}
                />
              </div>

              {/* Trade Item Category */}
              <div className="form-group">
                <label className="control-label">Trade Item Category*</label>
                <Select
                  options={tradeItemCategories}
                  value={find(tradeItemCategories, s => s.code.code === get(format, "tradeItemCategory.code", null)) || null}
                  name={"tradeItemCategoryCode"}
                  getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
                  getOptionValue={o => o.code.code}
                  onChange={s => {
                    loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId(get(format, "taxonomyId", null), s.code.code)
                    change("tradeItemCategory", {code : s.code.code } )
                    loadProperties()
                  }}
                />
              </div>
  
              {/* Transformation */}
              <div className="form-group">
                <label className="control-label">Transformation set</label>
                {get(format, 'transformationSetId') && <Link to={`/tools/export-transformation/${format.transformationSetId}`} className="btn btn-link p-0 ml-1">&#8594; View transformation</Link>}
                <Select 
                  isClearable={true}
                  getOptionLabel={b => b.name}
                  getOptionValue={b => b.id}
                  options={transformationSets}
                  onChange={b => {
                    change("transformationSetId", get(b, "id", null))
                    loadProperties()
                  }}
                  value={find(transformationSets, ts => ts.id === format.transformationSetId)} />
              </div>
                
              {/* Group by */}
              <div className="form-group">
                  <label className="control-label">Group output by</label>
                  <SelectString
                    value={get(format, "outputGroup", null)}
                    options={getGroupsOutputBy()}
                    onChange={v => change("outputGroup", v)}
                    />
          

              </div>

              {/* Number of trade items per file */}
              <div className="form-group">
                  <label className="control-label">Number of trade items per file (0 -> no split)</label>
                  <input className="form-control"
                  name="numberOfTradeItemsPerFile"
                  value={format.numberOfTradeItemsPerFile}
                  onChange={onInput}
                />
              </div>

              {/* Highlight differences */}
              {get(format, 'discriminator') === 'ExcelFormatConfigurationViewModel' && <div className="form-group">
                <label className="control-label">Highlight differences</label>
                <input
                  onChange={e => change('highlightDifferences', e.target.checked)}
                  checked={get(format, 'highlightDifferences', false)}
                  className="form-control"
                  type="checkbox"/>
              </div>
              }

              {/* is standard */}
              {get(format, 'discriminator') === 'ExcelFormatConfigurationViewModel' && <div className="form-group">
                <label className="control-label">Is standard?</label>
                <input
                  onChange={e => change('isStandard', e.target.checked)}
                  checked={get(format, 'isStandard', false)}
                  className="form-control"
                  type="checkbox"/>
              </div>
              }

              {/* Validate template */}
              {get(format, "discriminator") === "TemplateFormatConfigurationViewModel" && get(format, "id") && format.tradeItemCategory.code && <JSONTemplateValidation 
                willValidate={() => (async () => await onSave())()}
                formatConfigurationId={get(format, "id")} 
                tradeItemCategory={format.tradeItemCategory} />}

            </Card>
          </div>
  
          {/* Model form */}
          <div className="col-9">
            <OrderedFormatConfigurations
              configurations={format.orderedFormatConfigurations}
              discriminator={format.discriminator}
              businessRules={businessRules}
              businessRulesets={businessRulesets}
              propertyGroups={propertyGroups}
              onChange={list => change("orderedFormatConfigurations", list)}
            />
          </div>
        </div>
      </form>
    )
  }

}

export default FormatForm
