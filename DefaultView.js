import React from 'react'
import { Route } from 'react-router-dom'
import Nav from './navigation'
import NotificationContainer from './notifications/NotificationContainer';
import LoadingRunner from './runners/LoadingRunner';

const DefaultView = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
		<div className="fixed-nav sticky-footer bg-dark" id="page-top">
			<Nav />
			<div className="content-wrapper p-0 bg-light">
				<div className="container-fluid px-0">
					<Component {...matchProps} />
					<NotificationContainer />
					<div style={{display: "inline-block", zIndex:5010, position: "fixed", bottom: "10px", right: "20px"}}><LoadingRunner /></div>
				</div>
			</div>
      	{/* <Footer /> */}
		</div>
    )} />
  )
}

export default DefaultView
