const getFilteredDataInitialState = filters => ({
    pageNumber: 0,
    pageSize: 20,
    total: 0,
    results: [],
    loading: false,
    filters: filters,
    defaultFilters: filters
})

const filteredDataReducer = (state, action) => {
    switch (action.type) {
        case 'setLoading': return {...state, loading: action.value}
        case 'setResults': return {...state, results: action.results || [], total: action.total || 0}
        case 'setPageNumber': return {...state, pageNumber: action.value}
        case 'setPageSize': return {...state, pageSize: action.value}
        case 'setFilters': return {...state, filters: action.value}
        case 'setFilter': return {...state, filters: {...state.filters, [action.key]: action.value}}
        case 'resetFilters': return {...state, filters: {...state.defaultFilters}}
    
        default: return state
    }
}


export { getFilteredDataInitialState, filteredDataReducer }