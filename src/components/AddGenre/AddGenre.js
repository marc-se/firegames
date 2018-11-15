import React, { Component } from "react";
import { Modal, Button, Alert, Input, message } from "antd";
import firebase from "firebase";
import "firebase/database";

export default class AddGenre extends Component {
	state = {
		visible: false,
		error: false,
		genre: "",
		loading: false
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		this.setState({
			loading: true
		});

		const { genre } = this.state;

		if (genre !== "") {
			let url = genre
				.toString()
				.toLowerCase()
				.replace(/ /g, "");

			const addGenreAt = firebase
				.database()
				.ref("genres")
				.child(url);

			addGenreAt
				.set({
					title: genre,
					url: url
				})
				.then(() => {
					// display success message
					this.successMessage();

					this.setState({
						visible: false,
						error: false,
						loading: false,
						genre: ""
					});
				});
		} else {
			this.setState({
				error: true,
				loading: false
			});
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	handleInput(genre) {
		this.setState({
			genre
		});
	}

	handleCloseStatusMessage() {
		this.setState({
			error: false,
			success: false
		});
	}

	successMessage = () => {
		message.success("You successfully added a new Genre!", 3);
	};

	render() {
		const { genre } = this.state;
		return (
			<React.Fragment>
				<Button type="primary" icon="plus-circle-o" onClick={this.showModal}>
					Add Genre
				</Button>
				<Modal
					title="Add a new Genre"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText="ADD"
					cancelText="CANCEL"
					confirmLoading={this.state.loading}
				>
					<Input
						onChange={e => this.handleInput(e.target.value)}
						value={genre}
						placeholder="Genre"
					/>
					{this.state.error && (
						<Alert
							message="Something is missing 🤔"
							description="Please check your input. Have you added a Genre name?"
							type="error"
							closable
							onClose={() => this.handleCloseStatusMessage()}
							showIcon
						/>
					)}
				</Modal>
			</React.Fragment>
		);
	}
}
