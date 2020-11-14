import React, { Fragment, ChangeEvent, useState } from "react";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Alert, Input, message } from "antd";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/database";

import { updateSystems } from "../../reducers/actions.js";
import { System } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
}

interface State {}

const AddSystem = (props: Props) => {
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [systemName, setSystemName] = useState("");
	const [systemShortname, setSystemShortname] = useState("");

	const showModal = () => setVisible(true);

	const handleOk = async () => {
		/**
		 * ADD ENTRY FOR NEW SYSTEM
		 */

		setLoading(true);

		if (systemName !== "" && systemShortname !== "") {
			let url: string = systemName
				.toString()
				.toLowerCase()
				.replace(/ /g, "");

			const addSystemAt = firebase
				.database()
				.ref("systems")
				.child(url);

			try {
				await addSystemAt.set({
					games: 0,
					title: systemName,
					url: url,
					alias: systemShortname
				});
				successMessage();
				// update redux system index and update state
				let systems: Array<System> = [];
				const systemsRef = firebase.database().ref("systems");
				await systemsRef.once("value").then(snap => {
					snap.forEach(system => {
						systems.push(system.val());
					});
					props.dispatch(updateSystems(systems));
				});

				setError(false);
				setLoading(false);
				setSystemName("");
				setSystemShortname("");
				setVisible(false);
			} catch (error) {
				console.error(error);
			}
		} else {
			setError(true);
			setLoading(false);
		}
	};

	const handleCancel = () => setVisible(false);

	const handleSystemNameInput = (e: ChangeEvent<HTMLInputElement>) => setSystemName(e.target.value);

	const handleSystemShortNameInput = (e: ChangeEvent<HTMLInputElement>) =>
		setSystemShortname(e.target.value);

	const handleCloseStatusMessage = () => setError(false);

	const successMessage = () =>
		message.success("You successfully added a new System to your collection! 👾", 3);

	return (
        <Fragment>
			<Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal}>
				Add System
			</Button>
			<Modal
				title="Add a new System to your Collection 👾"
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="ADD"
				cancelText="CANCEL"
				confirmLoading={loading}
			>
				<SC.InputField onChange={handleSystemNameInput} placeholder="System Name" />
				<Input
					onChange={handleSystemShortNameInput}
					placeholder="System ShortName, like SNES/N64/PS4"
				/>
				{error && (
					<Alert
						message="Something is missing 🤔"
						description="Please check your input. Do you added a System Name?"
						type="error"
						closable
						onClose={handleCloseStatusMessage}
						showIcon
					/>
				)}
			</Modal>
		</Fragment>
    );
};

let component = AddSystem;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
