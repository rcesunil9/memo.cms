import React from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import * as actions from "./actions"
import * as selectors from "./selectors"
import CdmShortLogo from '../common/components/logo/CdmShortLogo'
import Loader from '../common/components/loaders/Loader'

class Login extends React.Component {
    constructor(props) {
      super(props)
      this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit = (e) => {
      e.preventDefault()
      var data = new FormData(e.target)
      let values = Array.from(data.entries())
      let login = values.find(x => x[0] === "email")
      let password = values.find(x => x[0] === "password")
      this.props.login({username:login[1], password: password[1]}, this.props.history)
    }

    render() {

      const { authenticating } = this.props

      return (
        <div className="bg-dark" style={{height:"100vh"}}>
          <div className="container py-7 h-100">
          <div className="row justify-content-center align-items-center h-100">
              <div className="col-5">
                <div className="w-100 mx-auto text-center pb-5">
                  <CdmShortLogo />
                </div>
                <div className="card card-login mx-auto">
                  <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="email">{`Email`}</label>
                        <input className="form-control" id="email" name="email" type="email" aria-describedby="emailHelp" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">{`Password`}</label>
                        <input className="form-control" id="password" name="password" type="password" placeholder="Password" />
                      </div>
                      <div className="mt-5">
                        {!authenticating && <button className="btn btn-block btn-primary py-2 text-uppercase"
                          type="submit"
                          style={{fontSize:"12px"}}
                          disabled={authenticating}>{`Login`}</button>}
                          {authenticating && <div className="text-center pb-2"><Loader /></div>}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
}

const mapStateToProps = (state) => {
    return {
      authenticating: selectors.isAuthenticating(state)
    }
}

export default withRouter(connect(mapStateToProps, actions)(Login, 'login'))
