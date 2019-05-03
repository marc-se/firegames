import React, { Component } from "react";
import { Modal, Button, Alert, Input, message } from "antd";
import { connect } from "react-redux";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";
import { updateSystems } from "../../reducers/actions.js";

const FireGamesInput = styled(Input)`
	margin-bottom: 10px !important;
`;

class AddSystem extends Component {
	static propTypes = {};

	state = {
		visible: false,
		systemName: "",
		systemShortName: "",
		error: false,
		loading: false
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		/**
		 * ADD ENTRY FOR NEW SYSTEM
		 */
		// create custom key from user system title from UI
		this.setState({
			loading: true
		});

		const { systemName, systemShortName } = this.state;

		if (systemName !== "" && systemShortName !== "") {
			let url = systemName
				.toString()
				.toLowerCase()
				.replace(/ /g, "");

			const addSystemAt = firebase
				.database()
				.ref("systems")
				.child(url);

			addSystemAt
				.set({
					games: 0,
					title: systemName,
					url: url,
					alias: systemShortName
				})
				.then(() => {
					// display success message
					this.successMessage();

					// update redux system index and update state
					let systems = [];
					const systemsRef = firebase.database().ref("systems");
					systemsRef.once("value").then(snap => {
						snap.forEach(system => {
							systems.push(system.val());
						});
						this.props.dispatch(updateSystems(systems));
						this.setState({
							visible: false,
							error: false,
							loading: false,
							systemName: "",
							systemShortName: ""
						});
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

	handleSystemNameInput(systemName) {
		this.setState({
			systemName
		});
	}

	handleSystemShortNameInput(systemShortName) {
		this.setState({
			systemShortName
		});
	}

	handleCloseStatusMessage() {
		this.setState({
			error: false,
			success: false
		});
	}

	successMessage = () => {
		message.success("You successfully added a new System to your collection! 👾", 3);
	};

	render() {
		return (
			<React.Fragment>
				<Button type="primary" icon="plus-circle-o" onClick={this.showModal}>
					Add System
				</Button>
				<Modal
					title="Add a new System to your Collection 👾"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText="ADD"
					cancelText="CANCEL"
					confirmLoading={this.state.loading}
				>
					<FireGamesInput
						onChange={e => this.handleSystemNameInput(e.target.value)}
						placeholder="System Name"
					/>
					<Input
						onChange={e => this.handleSystemShortNameInput(e.target.value)}
						placeholder="System ShortName, like SNES/N64/PS4"
					/>
					{this.state.error && (
						<Alert
							message="Something is missing 🤔"
							description="Please check your input. Do you added a System Name?"
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

let component = AddSystem;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
