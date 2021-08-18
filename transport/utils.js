export const initNewListingItem = () => {
  return {
    fileColumnIdentifier: null,
    fileColumnName: null,
  }
}

export const getRestAPIMethods = () => [
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
  { value: "GET", label: "GET" },
  { value: "PATCH", label: "PATCH" },
]