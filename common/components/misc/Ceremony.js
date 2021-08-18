import React from "react"
import ReactPlayer from 'react-player'

const CEREMONY_SONG_URL = "https://storage.sbg3.cloud.ovh.net/v1/AUTH_539b2b01a1164ecc8a6e23db416d1e9d/divers/bidone_doro_small.m4a"

class Ceremony extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playing: false,
            url: null
        }
        this.play = this.play.bind(this)
        this.stop = this.stop.bind(this)
    }

    play(e) {
        if(e) e.preventDefault()
        this.setState({
            url: CEREMONY_SONG_URL, 
            playing: true
        })
    }

    stop(e) {
        if(e) e.preventDefault()
        this.setState({
            playing: false,
            url: null
        })
    }

    render() {

        const { playing, url } = this.state

        return (
            <React.Fragment>

                {/* Start button */}
                {!playing && <button
                    className="btn btn-primary btn-lg"
                    onClick={this.play}
                    >Start the ceremony</button>}

                {/* Stop button */}
                {playing && <button
                    className="btn btn-danger btn-lg"
                    onClick={this.stop}
                    >Stop the ceremony</button>}

                {/* Player */}
                <ReactPlayer 
                    width="200px"
                    height="50px"
                    url={url}
                    playing={playing}
                    onEnded={() => this.stop()}
                    />
            </React.Fragment>
        )
    }

}

export default Ceremony
