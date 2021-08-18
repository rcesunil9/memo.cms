import React from 'react'
import get from 'lodash/get'
import { withRouter, Link } from 'react-router-dom'
import { getSubmissionById } from '../common/services/acknowledgement';
import PageWrapper from '../common/components/layout/PageWrapper';
import { date } from "../common/utils/date"
import Card from '../common/components/layout/Card';

class Submission extends React.Component {

    state = {
        submission: null
    }

    componentDidMount() {

        const { match } = this.props

        getSubmissionById(get(match, 'params.id')).then(res => this.setState({ submission: get(res, 'data', null) }))
    }

    render() {

        const { submission } = this.state

        return (
            <PageWrapper>

                <Card title='REST Submission'>

                    <h5>{date(get(submission, 'creationTimestamp')).format('YYYY-MM-DD HH:mm')} <small>by</small> {get(submission, 'retailerName')}</h5>

                    <br/><hr/>
                    
                    <div className="row">

                        {/* acknowledgeExpected */}
                        <div className="col-3">
                            <label className="control-label">Acknowledge Expected</label>
                            <p>{get(submission, 'acknowledgeExpected') === true ? 'Yes' : 'No'}</p>
                        </div>

                        {/* acknowledgeReceived */}
                        <div className="col-3">
                            <label className="control-label">Acknowledge Received</label>
                            <p>{get(submission, 'acknowledgeReceived') === true ? 'Yes' : 'No'}</p>
                        </div>

                        {/* acknowledgeTimeout */}
                        <div className="col-3">
                            <label className="control-label">Acknowledge Timeout</label>
                            <p>{get(submission, 'acknowledgeTimeout')}</p>
                        </div>

                        {/* actionName */}
                        <div className="col-3">
                            <label className="control-label">Action</label>
                            <p>
                                <Link to={`/action/${get(submission, 'actionId')}`}>{get(submission, 'actionName')}</Link>
                            </p>
                        </div>

                        {/* failed */}
                        <div className="col-3">
                            <label className="control-label">Status</label>
                            <p className={get(submission, 'failed') === true ? 'text-danger' : 'text-success'}>{get(submission, 'failed') === true ? 'Failed' : 'Success'}</p>
                        </div>

                        {/* retailerSubmissionId */}
                        <div className="col-3">
                            <label className="control-label">Retailer submission id</label>
                            <p>{get(submission, 'retailerSubmissionId')}</p>
                        </div>

                    </div>

                    <hr/>

                    <div className='row'>

                        {/* rawResponse */}
                        <div className="col-6">
                            <label className="control-label">Raw Response</label>
                            <p>{get(submission, 'rawResponse')}</p>
                        </div>

                        {/* acknowledgeRawResponse */}
                        <div className="col-6">
                            <label className="control-label">Acknowledge Raw Response</label>
                            <p>{get(submission, 'acknowledgeRawResponse')}</p>
                        </div>

                    </div>
                    
                </Card>

            </PageWrapper>
        )

    }

}

export default withRouter(Submission)