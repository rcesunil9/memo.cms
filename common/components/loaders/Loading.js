import React from 'react'
import './../../../../styles/scss/_loading.scss'

const Loading = ({className}) => (
  <div className={`loading ${className || ""}`} style={{height: '20px'}}>
    <div className="rect1"></div>
    <div className="rect2"></div>
    <div className="rect3"></div>
    <div className="rect4"></div>
    <div className="rect5"></div>
  </div>
)

export default Loading
