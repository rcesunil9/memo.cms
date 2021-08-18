import update from "immutability-helper"
import React from "react"
import ExcelFormatConfiguration from "./ExcelFormatConfiguration"
import TemplateFormatConfiguration from "./TemplateFormatConfiguration"
import ExcelIncludingTemplateFormatConfiguration from "./ExcelIncludingTemplateFormatConfiguration"
import { Columns, down, newConfiguration, up } from "./utils"

const forms = {
  ExcelFormatConfigurationViewModel: ExcelFormatConfiguration,
  TemplateFormatConfigurationViewModel: TemplateFormatConfiguration,
  ExcelIncludingTemplateConfigurationViewModel: ExcelIncludingTemplateFormatConfiguration
}

const OrderedFormatConfigurations = props => {
  const {
    configurations,
    discriminator,
    businessRules,
    businessRulesets,
    onChange,
    propertyGroups
  } = props

  const ConfigurationForm = forms[discriminator]
  if (!ConfigurationForm) throw new Error(`No form for discriminator '${discriminator}'`)

  const addNewConfiguration = () => onChange([...configurations, newConfiguration(discriminator)])
  const removeConfiguration = index => {
    if(!window.confirm("Are you sure?")) return;
    return onChange([...configurations.slice(0, index), ...configurations.slice(index + 1)])
  }
  const moveBefore = index => onChange(up(configurations, index))
  const moveAfter = index => onChange(down(configurations, index))

  return (
    <React.Fragment>
      <Columns>
        {configurations.map((configuration, i) => (
          <div key={i} className="mb-4">
            <div className="row mb-2">
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeConfiguration(i)}
                >
                  Remove
                </button>
              </div>
              <div className="col-9 text-right">
                {i > 0 && (
                  <button
                    type="button"
                    className="btn btn-default mr-2"
                    onClick={() => moveBefore(i)}
                  >
                    Move before
                  </button>
                )}
                {i < configurations.length - 1 && (
                  <button type="button" className="btn btn-secondary" onClick={() => moveAfter(i)}>
                    Move after
                  </button>
                )}
              </div>
            </div>
            <div>
              <ConfigurationForm
                configuration={configuration}
                businessRules={businessRules}
                businessRulesets={businessRulesets}
                propertyGroups={propertyGroups}
                onChange={form => onChange(update(configurations, { [i]: { $set: form } }))}
              />
            </div>
          </div>
        ))}
      </Columns>
      <button className="btn btn-secondary" type="button" onClick={addNewConfiguration}>
        Add configuration
      </button>
    </React.Fragment>
  )
}

export default OrderedFormatConfigurations
