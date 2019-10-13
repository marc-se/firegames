import React, { ChangeEvent, useState, FormEvent } from "react";
import { Form, Button, Radio, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import SystemSelect from "../SystemSelect/SystemSelect";

import { ContentWrapper, TextInput } from "./StyledComponents";
import { RadioChangeEvent } from "antd/lib/radio";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const WishlistInputForm = () => {
	const [text, setText] = useState("");
	const [system, setSystem] = useState("select a system");
	const [region, setRegion] = useState("PAL");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

	const handleSystemChange = (system: string) => setSystem(system);

	const handleRegionChange = (e: RadioChangeEvent) => setRegion(e.target.value);

	const successMessage = () => message.success("Game added to your wishlist", 3);

	const errorMessage = () => message.error("Please check your input", 3);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		try {
			if (text !== "" && system !== "select a system") {
				const addNodeAt = await firebase.database().ref("wishlist");
				const node = {
					title: text,
					system: system,
					purchased: false,
					region: region
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
					<RadioGroup onChange={handleRegionChange} defaultValue={region}>
						<RadioButton value="PAL">PAL</RadioButton>
						<RadioButton value="JAP">JAP</RadioButton>
						<RadioButton value="US">US</RadioButton>
					</RadioGroup>
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
