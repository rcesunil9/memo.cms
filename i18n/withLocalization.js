import React from 'react'
import { connect } from "react-redux";
import { addTranslationForLanguage, getTranslate } from 'react-localize-redux'
import { CDM_AVAILABLE_LANG } from './environment'

const mapStateToProps = (state) => {
    return {
      translate: getTranslate(state.locale),
      getCurrentLocaleCode: () => state.locale.languages.find(x=> x.active === true).code
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      initLocalization: (locale, key) => dispatch(addTranslationForLanguage(require(`./i18n/${locale}/${key}`), `${locale}`))
    }
}

export function withLocalization(WrappedComponent, key) {
  return connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component {

      componentWillMount() {
        CDM_AVAILABLE_LANG.forEach(l => this.props.initLocalization(l, key))
      }

      render() {
        return <WrappedComponent {...this.props}/>
      }
  })
}
