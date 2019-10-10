import React, { ChangeEvent, useState, FormEvent } from "react";
import { Form, Button, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import SystemSelect from "../SystemSelect/SystemSelect";

import { ContentWrapper, TextInput } from "./StyledComponents";

const WishlistInputForm = () => {
	const [text, setText] = useState("");
	const [system, setSystem] = useState("select a system");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

	const handleSystemChange = (system: string) => setSystem(system);

	const successMessage = () => message.success("Game added to your wishlist", 3);

	const errorMessage = () => message.error("Please check your input", 3);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		try {
			if (text !== "" && system !== "select a system") {
				const addNodeAt = await firebase.database().ref("wishlist");
				const node = {
					title: text,
					system: system
				};
				await addNodeAt.push(node);
				successMessage();
				setText("");
				setSystem("");
				return;
			}
			errorMessage();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ContentWrapper>
			<Form layout="inline" onSubmit={handleSubmit}>
				<Form.Item>
					<TextInput
						placeholder="Add a game to your wishlist"
						type="text"
						value={text}
						onChange={handleTitleChange}
					/>
				</Form.Item>
				<Form.Item>
					<SystemSelect minWidth={250} handleChange={handleSystemChange} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Add Game
					</Button>
				</Form.Item>
			</Form>
		</ContentWrapper>
	);
};

export default WishlistInputForm;
