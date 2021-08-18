import React from "react"
import Card from "../layout/Card"

const MyForm = ({title, children}) => (
	<Card title={title}>
		{children}
	</Card>
)

export default MyForm
