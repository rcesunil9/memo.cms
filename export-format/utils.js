import update from "immutability-helper"
import chunk from "lodash/chunk"
import find from "lodash/find"
import map from "lodash/map"
import reverse from "lodash/reverse"
import React from "react"

export const getDefaultExcelSheetMapping = () => {
  return {
      columnIndex: 0,
      property: "",
      propertyGroup: "",
      businessRuleId: "",
      sheetIndex: 0
  }
}

export const getDefaultSheetArea = () => {
  return {
    startingCell: '',
    endingCell: '',
    condition: '',
    arrayPath: '',
    repetitionSettings: {
      numberOfColumns: 0,
      numberOfRows: 0
    }
  }
}

export const getDefaultExcelIncludeTemplateSheetMapping = () => {
  return {
    sheetName: '',
    areas: [
      {
        startingCell: '',
        endingCell: '',
        condition: '',
        arrayPath: '',
        repetitionSettings: {
          numberOfColumns: 0,
          numberOfRows: 0
        }
      }
    ]

  }
}

export const getDefaultExcelSheetConfiguration = index => {
  return {
    sheetIndex: index || 0,
    dataStartingRow: 1,
    duplicateChildrenAfterParent: false,
    hideAssortmentOnly: false,
    hideNonAssortment: false,
    isChannelManaged: false,
    businessRuleSetIds: []
  }
}

export const formatTypes = () => [
  {
    name: "Excel",
    discriminator: "ExcelFormatConfigurationViewModel",
    configuration: () => ({
      fileLocation: "",
      businessRuleSetId: "",
      excelMappingConfiguration: {
        orderedColumnMappings: [
          // {
          //   columnIndex: 0,
          //   property: "",
          //   propertyGroup: "",
          //   businessRuleId: "",
          //   sheetIndex: 0
          // }
        ]
      },
      sheetConfigurations: [
        getDefaultExcelSheetConfiguration()
      ]
    })
  },
  {
    name: "Template",
    discriminator: "TemplateFormatConfigurationViewModel",
    configuration: () => ({
      type: "XML",
      validator: "",
      template: "",
      businessRuleSetId: null
    })
  },
  {
    name: "Excel Including Template",
    discriminator: "ExcelIncludingTemplateConfigurationViewModel",
    configuration: () => ({
      fileLocation: "",
      businessRuleSetId: "",
      sheetConfigurations: []
    })
  }
]

export const getGroupsOutputBy = () => ["None", "TradeItem", "Manufacturer"]

export const newConfiguration = discriminator => {
  const type = find(formatTypes(), ["discriminator", discriminator])
  if (!type) return undefined
  return type.configuration()
}

export const templateTypes = () => ["XML", "JSON", "CSV", "AmazonJson", "PDF", "Excel", "TradeItem", "TradeItems"]
export const isSimpleTemplateValidator = type => type !== "AmazonJson"
export const isAmazonTemplateValidator = type => type === "AmazonJson"
export const doesTemplateNeedUpload = type => type === "Excel"
export const getDiscriminatorForTemplateType = templateType => { 
  switch(templateType) {
    case "AmazonJson":
      return "AmazonTemplateSpecificationViewModel"
    case "Excel":
      return "ExcelTemplateSpecificationViewModel"
    default:
      return "ValidableTemplateSpecificationViewModel"
  }
}

// This wrapper makes the form unmount when navigation state changes.
// Otherwise we would have to dispatch the reset action also when navigating
// from "Edit something" to "Create something".
export const keyed = Component =>
  class Keyed extends React.Component {
    render() {
      return <Component key={this.props.match.params.id || "new"} {...this.props} />
    }
  }

export const makeOption = r => (r ? { label: r.name, value: r.id } : null)

export const inputChanger = (original, onChange) => e => {
  let k = e.target.name
  if (k === "$wordpass") k = "password"

  let v = e.target.value
  if (e.target.type === "checkbox") v = e.target.checked
  const n = update(original, { [k]: { $set: v } })
  onChange(n)
}

// https://codegolf.stackexchange.com/questions/3971/generate-excel-column-name-from-index
export function excelColumnLabel(colNum) {
  // example: 16384 => "XFD"
  let mostSig = Math.max(0, Math.floor((colNum - 26 - 1) / 26 ** 2))
  let midSig = Math.max(0, Math.floor((colNum - mostSig * 26 ** 2 - 1) / 26))
  let leastSig = colNum - mostSig * 26 ** 2 - midSig * 26

  return String.fromCharCode(...[mostSig, midSig, leastSig].filter(d => d).map(d => d + 64))
}

export const Columns = props => {
  const num = 2
  const className = `col-${12 / num}`
  const rows = chunk(React.Children.toArray(props.children), num)
  return map(rows, (row, i) => (
    <div key={`${i}`} className="row">
      {map(row, (col, j) => (
        <div key={`${i}-${j}`} className={className}>
          {col}
        </div>
      ))}
    </div>
  ))
}

export const up = (list, i) => {
  if (i < 1) return list
  const a = list[i - 1]
  const b = list[i]
  return [...list.slice(0, i - 1), b, a, ...list.slice(i + 1)]
}
export const down = (list, i) => reverse(up(reverse(list), list.length - i - 1))


export const getDefaultValidatorReference = () => {
  return {
    filename: null,
    content: null
  }
}
