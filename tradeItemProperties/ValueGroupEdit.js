import update from "immutability-helper"
import filter from "lodash/filter"
import includes from "lodash/includes"
import map from "lodash/map"
import toPairs from "lodash/toPairs"
import flatMap from "lodash/flatMap"
import take from "lodash/take"
import drop from "lodash/drop"
import uniq from "lodash/uniq"
import React from "react"
import LanguageSelect from "../common/components/lang/LanguageSelect"

const ValueGroupEdit = props => {
  const {
    onCancel,
    onSave,
    onChange,
    valueGroup,
    languages,
    currentLanguage,
    onLanguageChange
  } = props

  const change = attributeName => newValue =>
    onChange(update(valueGroup, { [attributeName]: { $set: newValue } }))
  const save = e => {
    e.preventDefault()
    onSave()
  }

  // Show only used languages in the language selector
  const knownLanguages = uniq(map(flatMap(valueGroup.values, v => toPairs(v.values)), 0))
  const knownLanguageOptions = filter(languages, l => includes(knownLanguages, l.label))
  const otherLanguageOptions = filter(languages, l => !includes(knownLanguages, l.label))

  // Adds an empty value to the current group
  const dummyValue = languageCode => ({ values: { [languageCode]: "" }, synonyms: { [languageCode]: [] }, code: "" })
  const addValue = () =>
    onChange(update(valueGroup, { values: { $push: [dummyValue(currentLanguage.code)] }}))

  // Adds a language to the current group (by adding an placeholder value with that language)
  const addLanguage = languageCode => {
    if (valueGroup.values.length > 0) {
      const newval = update(valueGroup.values[0], { values: { $merge: { [languageCode]: "" } } })
      onChange(update(valueGroup, { values: { 0: { $set: newval } } }))
    } else {
      onChange(update(valueGroup, { values: { $push: [dummyValue(languageCode)] } }))
    }
    onLanguageChange(languageCode)
  }

  const currentLanguageOption = { value: currentLanguage.code, label: currentLanguage.code }

  return (
    <form onSubmit={save}>
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-control"
          autoComplete="off"
          required
          value={valueGroup.name}
          onChange={e => change("name")(e.target.value)}
        />
      </div>
      <div className="form-row">
      <div className="form-group col">
        <label>Editor language</label>
        <LanguageSelect
          value={currentLanguageOption}
          onChange={v => onLanguageChange(v.label)}
          options={knownLanguageOptions}
        />
      </div>
      <div className="form-group col">
        <label>Add another language</label>
        <LanguageSelect onChange={v => addLanguage(v.label)} options={otherLanguageOptions} />
      </div>
      </div>
      <div className="form-group">
        <ValuesEdit
          values={valueGroup.values}
          onChange={change("values")}
          currentLanguage={currentLanguage}
        />
      </div>
      <div className="form-group d-flex justify-content-end">
        <button className="btn btn-link" type="button" onClick={addValue}>
          + add a value
        </button>
      </div>
      <div className="form-group d-flex justify-content-end">
        <button className="btn btn-secondary mr-2" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  )
}

const ValuesEdit = ({ values, onChange, currentLanguage }) => {
  const currentLanguageCode = currentLanguage.code

  const changeCode = (index, code) =>
    onChange(update(values, { [index]: { code: { $set: code } } }))

  const changeValue = (index, value) =>
    onChange(update(values, { [index]: { values: { [currentLanguageCode]: { $set: value } } } }))

  const changeSynonyms = (index, value) =>
  {
    var splitValues = value.split(";");
    onChange(update(values, { [index]: { synonyms: { [currentLanguageCode]: { $set: splitValues } } } }))
  }

  const processSynonyms = (value) =>
  {
    if(value)
      return value.join(';')
  }

  const removeValue = index => onChange([...take(values, index), ...drop(values, index + 1)])

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Value</th>
          <th>Synonyms</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {map(values, (value, index) => (
          <tr key={index}>
            <td>
              <input
                autoComplete="off"
                className="form-control"
                value={value.code}
                onChange={e => changeCode(index, e.target.value)}
              />
            </td>
            <td>
              <input
                autoComplete="off"
                className="form-control"
                value={value.values[currentLanguageCode] || ""}
                onChange={e => changeValue(index, e.target.value)}
              />
            </td>
            <td>
              <input
                autoComplete="off"
                className="form-control"
                value={processSynonyms(value.synonyms[currentLanguageCode] || "") }
                onChange={e => changeSynonyms(index, e.target.value)}
              />
            </td>
            <td>
              <button className="btn btn-link" type="button" onClick={() => removeValue(index)}>
                remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ValueGroupEdit
