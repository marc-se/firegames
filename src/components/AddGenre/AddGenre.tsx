import React, { ChangeEvent, useState } from "react";
import { Modal, Button, Alert, Input, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

const AddGenre = () => {
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState(false);
	const [genre, setGenre] = useState("");
	const [loading, setLoading] = useState(false);

	const showModal = () => setVisible(true);

	const hideModal = () => setVisible(false);

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => setGenre(e.target.value);

	const handleCloseStatusMessage = () => setError(false);

	const successMessage = () => message.success("You successfully added a new Genre!", 3);

	const handleOk = async () => {
		setLoading(true);

		if (genre !== "") {
			const url = genre
				.toString()
				.toLowerCase()
				.replace(/ /g, "");

			try {
				const addGenreAt = await firebase
					.database()
					.ref("genres")
					.child(url);

				await addGenreAt.set({
					title: genre,
					url: url
				});

				successMessage();

				setVisible(false);
				setError(false);
				setLoading(false);
				setGenre("");
			} catch (error) {
				console.error(error);
			}
		} else {
			setError(true);
			setLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Button type="primary" icon="plus-circle-o" onClick={showModal}>
				Add Genre
			</Button>
			<Modal
				title="Add a new Genre"
				visible={visible}
				onOk={handleOk}
				onCancel={hideModal}
				okText="ADD"
				cancelText="CANCEL"
				confirmLoading={loading}
			>
				<Input onChange={handleInput} value={genre} placeholder="Genre" />
				{error && (
					<Alert
						message="Something is missing 🤔"
						description="Please check your input. Have you added a Genre name?"
						type="error"
						closable
						onClose={handleCloseStatusMessage}
						showIcon
					/>
				)}
			</Modal>
		</React.Fragment>
	);
};

export default AddGenre;
