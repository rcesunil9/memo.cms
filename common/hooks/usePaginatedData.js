import { useReducer, useCallback } from "react";
import get from "lodash/get";

export const initialState = {
  pageNumber: 0,
  pageSize: 20,
  total: 0,
  data: [],
  loading: false
};

export function reducer(state, [type, payload]) {
  switch (type) {
    case "paginationUpdated":
      return {
        ...state,
        pageNumber: payload.pageNumber,
        pageSize: payload.pageSize
      };
    case "dataUpdated":
      return {
        ...state,
        data: payload.data,
        total: payload.total
      };
    case "loadingUpdated":
      return {
        ...state,
        loading: payload
      };
    default:
      return state;
  }
}

function usePaginatedData(defaultState) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...(defaultState || {})
  });

  const fetch = useCallback(
    (fetchPromise, pageNumber, pageSize) => {
      dispatch(["loadingUpdated", true]);
      dispatch([
        "paginationUpdated",
        {
          pageNumber,
          pageSize
        }
      ]);
      return fetchPromise
        .then(res => {
          dispatch(["loadingUpdated", false]);
          dispatch([
            "dataUpdated",
            {
              data: get(res, "data.results"),
              total: get(res, "data.total")
            }
          ]);
        })
        .catch(e => {
          dispatch(["loadingUpdated", false]);
          alert(e);
        });
    },
    [dispatch]
  );

  return [state, fetch];
}

export default usePaginatedData;
