import React from 'react'
import * as env from '../../../environment'

const Footer = () => (
		<footer className="sticky-footer">
		  <div className="container">
		    <div className="text-center">
		      <small>Copyright © Cedemo 2018 - {`${env.DOMAIN}`}</small>
		    </div>
		  </div>
		</footer>
	)

export default Footer
