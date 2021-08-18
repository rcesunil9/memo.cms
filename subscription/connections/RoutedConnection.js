import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PageWrapper from "../../common/components/layout/PageWrapper"
import Card from "../../common/components/layout/Card"
import ActionsBar from "../../common/components/layout/ActionsBar"
import Connection from './Connection'


const RoutedConnection = props => {

    const { match, history } = props

    const id = match.params.id

    return (
      <div className="container-fluid">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">{id ? "Edit connection" : "New connection"}</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/subscription/connections`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/subscription/connection`} className="btn btn-success mr-2">
                + Create new connection
              </Link>
            )}
          </div>
        </ActionsBar>

        <PageWrapper>
          
          <div className="row">
              <div className="col-6">
                <Card>

                    <Connection
                        connectionId={id}
                        onConnectionCreated={res => history.push(`/subscription/connection/${res.data}`)}
                        onConnectionUpdated={res => {}}
                        onConnectionDeleted={res => history.push(`/subscription/connections`)}
                        />

                </Card>
              </div>

            </div>

        </PageWrapper>

      </div>
    )

}

export default withRouter(RoutedConnection)