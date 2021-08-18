import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { localeReducer as locale } from 'react-localize-redux'
import manufacturers from './manufacturers/reducer'
import retailers from './retailers/reducer'
import tradeItems from './tradeItems/reducer'
import auth from './auth/reducer'
import quickSearch from './quickSearch/reducer'
import navigation from './navigation/reducer'
import notifications from './notifications/reducer'
import tradeItemProperties from './tradeItemProperties/reducer'
import preComputing from './preComputing/reducer'
import triggers from './triggers/reducer'
import userManagement from './user-management/reducer'
import matrixMapping from './matrixMapping/reducer'
import businessRules from './businessRules/reducer'
import importJobs from './importJobs/reducer'
import transformationManagement from './transformationManagement/reducer'
import matching from './matching/reducer'
import exportFormat from './export-format/reducer'
import runners from './runners/reducer'
import acknowledgement from "./acknowledgement/reducer"
import exportJobs from './exportJobs/reducer'
import transport from './transport/reducer'

const defaultReducers = {}

const reducersToCombine = {
	auth,
	quickSearch,
	navigation,
	tradeItems,
	manufacturers,
	notifications,
	retailers,
	tradeItemProperties,
  preComputing,
	triggers,
	userManagement,
	matrixMapping,
	businessRules,
	importJobs,
	transformationManagement,
	matching,
	locale,
	exportFormat,
	runners,
	acknowledgement,
	exportJobs,
	transport,
}

const reducers = combineReducers(reducersToCombine);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const init = Object.assign({}, defaultReducers, initialState || {})
  const store = createStore(
		reducers,
		init,
		composeEnhancers(applyMiddleware(thunk)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept([
			'./manufacturers/reducer.js',
			'./tradeItems/reducer.js',
			'./auth/reducer.js',
			'./quickSearch/reducer.js',
			'./navigation/reducer.js',
			'./notifications/reducer.js',
			'./tradeItemProperties/reducer.js',
      './preComputing/reducer.js',
			'./user-management/reducer.js',
			'./matrixMapping/reducer.js',
			'./businessRules/reducer.js',
			'./importJobs/reducer.js',
			'./transformationManagement/reducer.js',
			'./matching/reducer.js',
			'./export-format/reducer.js',
			'./runners/reducer.js',
			'./acknowledgement/reducer.js',
			'./exportJobs/reducer.js',
			'./transport/reducer.js',
		], () => {
      store.replaceReducer(reducers)
    });
  }
  return store
}
