import createReducer from "./createReducer"

const createIsFetching = ({ FAILURE, REQUEST, SUCCESS }) => createReducer(false, {
  [FAILURE]: () => false,
  [REQUEST]: () => true,
  [SUCCESS]: () => false,
})

export default createIsFetching
