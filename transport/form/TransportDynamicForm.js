import React from "react"
import get from "lodash/get"
import RestTransportConfiguration from "./RestTransportConfiguration"
import FtpTransportConfiguration from "./FtpTransportConfiguration"

const TransportDynamicForm = (props) => {

    switch(get(props, "transportConfiguration.discriminator")){

        case "RestTransportConfigurationViewModel":
            return <RestTransportConfiguration {...props} />
        
        case "FtpTransportConfigurationViewModel":
            return <FtpTransportConfiguration {...props} />

        default:
            return <div>Could not find dynamic form for {get(props, "transportConfiguration.discriminator")}</div>
    }

}

export default TransportDynamicForm