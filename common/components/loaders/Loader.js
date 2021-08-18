import React from 'react'
import './../../../../styles/scss/_loader.scss'


// const Stripper = () => (
//   <div style={{position: "fixed", right: "0", bottom: "-36px", zIndex: "5000", width: "180px"}}>
//     <div style={{width: '100%', height: 0, paddingBottom: '144%', position: 'relative'}}><iframe title="easter-stripper" src="https://giphy.com/embed/UJzsIiAIK21DW" width="100%" height="100%" style={{position: 'absolute'}} frameBorder={0} className="giphy-embed" allowFullScreen /></div><p><a href="https://giphy.com/gifs/music-video-stripper-UJzsIiAIK21DW">via GIPHY</a></p>
//   </div>
// )


const Loader = () => (
  <div className="loader-group">
    <div className="bigSqr">
      <div className="square first"></div>
      <div className="square second"></div>
      <div className="square third"></div>
      <div className="square fourth"></div>
    </div>
  </div>
)

export default Loader;
