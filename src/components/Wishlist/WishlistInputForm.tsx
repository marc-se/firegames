import React, { ChangeEvent, useState } from "react";
import { Input, Select, Form, Button } from "antd";

const { Option } = Select;

const WishlistInputForm = () => {
	const [text, setText] = useState("");
	const [system, setSystem] = useState("select a system");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

	const handleSystemChange = (system: string) => setSystem(system);

	const handleSubmit = () => console.log("game added");

	return (
		<Form layout="inline" onSubmit={handleSubmit}>
			<Form.Item>
				<Input type="text" value={text} onChange={handleTitleChange} />
			</Form.Item>
			<Form.Item>
				<Select value={system} onChange={handleSystemChange}>
					<Option value="ps4">PS4</Option>
					<Option value="ps3">PS3</Option>
				</Select>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Add Game
				</Button>
			</Form.Item>
		</Form>
	);
};

export default WishlistInputForm;
