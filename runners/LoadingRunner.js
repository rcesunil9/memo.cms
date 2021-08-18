import React from "react"
import { connect } from "react-redux"
import axios from "axios"
import * as selectors from "./selectors"
import * as actions from "./actions"
import Loader from '../common/components/loaders/Loader'


class LoadingRunner extends React.Component {
  
  componentDidMount() {    
    const {
      addLoadingRunner,
      removeLoadingRunner,
      resetLoadingRunner,
    } = this.props

    resetLoadingRunner()
    this.interceptorRequest = axios.interceptors.request.use(req => {addLoadingRunner(); return req}, error => {removeLoadingRunner(); return Promise.reject(error)})
    this.interceptorReceive = axios.interceptors.response.use(response => {removeLoadingRunner(); return response}, error => {removeLoadingRunner(); return Promise.reject(error)})
  }

  componentWillUnmount() {
    axios.interceptors.response.eject(this.interceptorRequest)
    axios.interceptors.response.eject(this.interceptorReceive)
  }

  render() {
    const { isLoading } = this.props
    return isLoading ? <Loader/> : <div></div>
  }

}


const mapStateToProps = (state) => {
    return {
      isLoading: selectors.isLoading(state),
    }
}

export default connect(mapStateToProps, actions)(LoadingRunner)
