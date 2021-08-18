import React from "react"
import Sticky from 'react-stickynode'

const style = {
  // boxShadow: "rgba(0, 0, 0, 0.3) 0px -2px 16px"
}

const ActionsBar = ({children}) => (
  <Sticky enabled={true} top={`#mainNav`} innerZ={500}>
    <div className="row bg-white py-2 border-bottom" style={style}>
        {children}
    </div>
  </Sticky>
)

export default ActionsBar
