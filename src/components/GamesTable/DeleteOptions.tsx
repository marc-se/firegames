import React, { Component } from "react";
import { Button } from "antd";

import * as SC from "./StyledComponents";

interface Props {
	onCancel: () => void;
	onOk: () => void;
}

export default class DeleteOptions extends Component<Props> {
	onCancel = () => {
		const { onCancel } = this.props;
		onCancel();
	};

	onOk = () => {
		const { onOk } = this.props;
		onOk();
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
