import { createSelector } from 'reselect'

// Loading runner
//
const getLoading = (state) => state.runners.loading
export const isLoading = createSelector(getLoading, l => l > 0)
