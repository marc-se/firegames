import React, { Component } from "react";
import { Button } from "antd";

import * as SC from "./StyledComponents";

export default class DeleteOptions extends Component {
	onCancel = () => {
		this.props.onCancel();
	};

	onOk = () => {
		this.props.onOk();
	};

	render() {
		return (
			<SC.DeleteOptionsContainer>
				<Button size="small" onClick={this.onCancel}>
					CANCEL
				</Button>
				<Button size="small" type="danger" onClick={this.onOk}>
					DELETE
				</Button>
			</SC.DeleteOptionsContainer>
		);
	}
}
