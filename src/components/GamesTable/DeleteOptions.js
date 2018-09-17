import React, { Component } from "react";
import { Button } from "antd";
import styled from "styled-components";

const FireGamesWrapper = styled.div`
	> button {
		margin-right: 10px;
	}
`;

export default class DeleteOptions extends Component {
	onCancel = () => {
		this.props.onCancel();
	};

	onOk = () => {
		this.props.onOk();
	};

	render() {
		return (
			<FireGamesWrapper>
				<Button size="small" onClick={this.onCancel}>
					CANCEL
				</Button>
				<Button size="small" type="danger" onClick={this.onOk}>
					DELETE
				</Button>
			</FireGamesWrapper>
		);
	}
}
