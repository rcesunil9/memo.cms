import { createSelector } from 'reselect'

const getLanguages = state => state.locale.languages

export const getActiveLanguage = createSelector(
  getLanguages,
  languages => languages.filter(l => l.active)[0].code
)
