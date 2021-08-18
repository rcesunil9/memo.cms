import isArray from "lodash/isArray"
// distant API calls have same pattern
//
const call = (dispatch, api, {REQUEST, FAILURE}) => {
  if(isArray(REQUEST)) REQUEST.forEach(a => dispatch(a))
  else dispatch({type: REQUEST})
  return api()
    .then(res => res.data)
    .catch(e => {
      if(isArray(FAILURE)) FAILURE.forEach(a => dispatch(a))
      else dispatch({type: FAILURE})
      console.error(e)
      return Promise.reject(e)
    })
}

export default call
