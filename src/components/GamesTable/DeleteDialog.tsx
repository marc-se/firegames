import React, { Component } from "react";
import { Button, Popover, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import DeleteOptions from "./DeleteOptions";

interface Props {
	system: string;
	gameID: string;
}

interface State {
	isPopoverVisible: boolean;
}

export default class DeleteDialog extends Component<Props, State> {
	state = {
		isPopoverVisible: false
	};

	onSelectChange = () => {
		this.handlePopoverState();
	};

	hidePopover = () => {
		this.setState({
			isPopoverVisible: false
		});
	};

	handlePopoverState() {
		const { isPopoverVisible } = this.state;
		this.setState({ isPopoverVisible: !isPopoverVisible });
	}

	handleDelete = () => {
		const deleteNodeAt = firebase.database().ref(`games/${this.props.system}/${this.props.gameID}`);
		deleteNodeAt.set(null).then(() => {
			this.successMessage();
		});
	};

	successMessage = () => {
		message.success("Game successfully deleted! 😔👋🏼", 3);
	};

	render() {
		return (
			<Popover
				content={<DeleteOptions onOk={this.handleDelete} onCancel={this.onSelectChange} />}
				title="Really delete this Game?"
				trigger="click"
				visible={this.state.isPopoverVisible}
				onVisibleChange={this.onSelectChange}
			>
				<Button type="danger" shape="circle" icon="delete" />
			</Popover>
		);
	}
}
