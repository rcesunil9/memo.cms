import React from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import { getReleaseNotes } from '../common/services/releaseNotes';
import Card from '../common/components/layout/Card';
import { date } from '../common/utils/date';
import PageWrapper from 'app/common/components/layout/PageWrapper';

const containerStyle = {
    // height: '1000px',
    maxWidth: '900px',
    // overflowX: 'scroll',
    // display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',

    margin: '0 auto'
}

class ReleaseNotes extends React.Component {

    state = {
        releaseNotes: null
    }

    componentDidMount() {
        this.refresh()
    }

    refresh() {
        getReleaseNotes().then(res => this.setState({ releaseNotes: res.data }))
    }

    render() {

        const { releaseNotes } = this.state

        return (
            <PageWrapper>
    
                <h1>{get(releaseNotes, 'meta.title')}</h1>
                <p className="lead font-weight-light mb-5">{get(releaseNotes, 'meta.subtitle')}</p>

                <div
                    className="row" 
                    style={containerStyle}
                    >

                    {map(get(releaseNotes, "releases"), (rn, rnId) => (
                        <div 
                            key={`rn-${rnId}`}
                            className="col-md-12"
                            >

                            <Card
                                title={`${get(rn, "version")} - ${get(rn, "title")}`}
                                className="mb-4"
                                >

                                <i className="font-weight-light d-block mb-3">{date(get(rn, "date")).format("MMMM Do YYYY, h:mm:ss a")}</i>

                                <u className="font-weight-bold mb-3 d-block">Summary</u>

                                <ul>
                                    {map(get(rn, "highlights"), (highlight, hId) => (
                                        <li key={`highlight-${rnId}-${hId}`}>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>

                                <u className="font-weight-bold mb-3 d-block">Resources</u>

                                <ul>
                                    {map(get(rn, "links"), (l, lId) => (
                                        <li key={`links-${rnId}-${lId}`}>
                                            <a href={get(l, "link")}>{get(l, "title")}</a>
                                        </li>
                                    ))}
                                </ul>

                            </Card>

                        </div>
                    ))}

                </div>

            </PageWrapper>
        )
    }

}

export default ReleaseNotes
