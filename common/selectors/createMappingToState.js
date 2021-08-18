import dotProp from "dot-prop-immutable"
import reduce from "lodash/reduce"
import isFunction from "lodash/isFunction"

const createMappingToState = selectors => state => reduce(selectors, (result, selector, key) => isFunction(selector) ? dotProp.set(result, `${key}`, selector(state)) : result, {})

export default createMappingToState;