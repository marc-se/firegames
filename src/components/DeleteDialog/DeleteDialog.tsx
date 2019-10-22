import React, { useState } from "react";
import { Button, Popover, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import DeleteOptions from "./DeleteOptions";

interface Props {
	url: string;
}

const DeleteDialog = (props: Props) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisible = () => setIsVisible(!isVisible);

	const handleDelete = () => {
		const { url } = props;
		const deleteNodeAt = firebase.database().ref(url);
		deleteNodeAt.set(null).then(() => {
			successMessage();
		});
	};

	const successMessage = () => {
		message.success("Game successfully deleted! 😔👋🏼", 3);
	};

	return (
		<Popover
			content={<DeleteOptions onOk={handleDelete} onCancel={toggleVisible} />}
			title="Really delete this Game?"
			trigger="click"
			visible={isVisible}
			onVisibleChange={toggleVisible}
		>
			<Button type="danger" shape="circle" icon="delete" />
		</Popover>
	);
};

export default DeleteDialog;
