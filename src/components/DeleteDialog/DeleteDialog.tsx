// @ts-nocheck
import React, { useState } from "react";
import { Button, Popover, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import DeleteOptions from "./DeleteOptions";

interface Props {
	url: string;
	system?: string;
}

const DeleteDialog = (props: Props) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisible = () => setIsVisible(!isVisible);

	const handleDelete = () => {
		const { url, system } = props;
		const deleteNodeAt = firebase.database().ref(url);
		deleteNodeAt.set(null).then(() => {
			if (system) {
				const gamesNode = firebase.database().ref("games/" + system);
				const updateStatisticsForSystem = firebase.database().ref(`systems/${system}/`);
				gamesNode.once("value", snap => {
					let obj = snap.val();
					let gamesCount = Object.keys(obj).length;
					updateStatisticsForSystem.update({
						games: gamesCount
					});
				});
			}
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
