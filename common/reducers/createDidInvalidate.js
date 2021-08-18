import createReducer from "./createReducer"

const createDidInvalidate = ({ INVALIDATE, REQUEST, SUCCESS }) => createReducer(false, {
  [REQUEST]: () => false,
  [SUCCESS]: () => false,
  [INVALIDATE]: () => true,
})

export default createDidInvalidate
