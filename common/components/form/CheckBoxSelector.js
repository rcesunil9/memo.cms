import React from "react"
import find from "lodash/find"
import filter from "lodash/filter"
import { newCounter } from "../../utils/counter"

const uniqueCounter = newCounter(1)

// A multiple-options selector implemented as a stack of checkboxes.
// The main properties are similar to those of react-select.
const CheckboxSelector = props => {
  const { options, name, valueArray, onChange } = props

  const idPrefix = `checkboxselector-${name}-${uniqueCounter.next()}`
  const makeID = index => `${idPrefix}-${index}`

  // Tells whether a given option is checked.
  const isChecked = option => find(valueArray, o => o.value === option.value) !== undefined

  // Returns a new checked list with the given option toggled.
  const toggle = option =>
    isChecked(option) ? filter(valueArray, o => o.value !== option.value) : [...valueArray, option]

  return options.map((option, index) => (
    <div className="form-check" key={option.value}>
      <input
        className="form-check-input"
        type="checkbox"
        id={makeID(index)}
        value={option.value}
        checked={isChecked(option)}
        onChange={() => onChange(toggle(option))}
      />
      <label className="form-check-label" htmlFor={makeID(index)}>
        {option.label}
      </label>
    </div>
  ))
}

export default CheckboxSelector
