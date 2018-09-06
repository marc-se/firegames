import React, { Component } from 'react';
import { Button, Popover, message } from 'antd';
import * as firebase from 'firebase';
import DeleteOptions from './DeleteOptions.js';

export default class DeleteDialog extends Component {
	state = {
		isPopoverVisible: false,
	};

	onSelectChange = () => {
		this.handlePopoverState();
	};

	hidePopover = () => {
		this.setState({
			isPopoverVisible: false,
		});
	};

	handlePopoverState() {
		this.setState({ isPopoverVisible: !this.state.isPopoverVisible });
	}

	handleDelete = () => {
		let deleteNodeAt = firebase.database().ref(`games/${this.props.system}/${this.props.gameID}`);
		deleteNodeAt.set(null).then(() => {
			this.successMessage();
		});
	};

	successMessage = () => {
		message.success('Game successfully deleted! 😔👋🏼', 3);
	};

	render() {
		return (
			<Popover
				content={<DeleteOptions onOk={this.handleDelete} onCancel={this.onSelectChange} />}
				title="Really delete this Game?"
				trigger="click"
				visible={this.state.isPopoverVisible}
				onVisibleChange={() => this.onSelectChange()}
			>
				<Button type="danger" shape="circle" icon="delete" />
			</Popover>
		);
	}
}
