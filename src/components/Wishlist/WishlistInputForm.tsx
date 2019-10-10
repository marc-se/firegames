import React, { ChangeEvent, useState } from "react";
import { Form, Button } from "antd";

import SystemSelect from "../SystemSelect/SystemSelect";

import { ContentWrapper, TextInput } from "./StyledComponents";

const WishlistInputForm = () => {
	const [text, setText] = useState("");
	const [system, setSystem] = useState("select a system");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

	const handleSystemChange = (system: string) => setSystem(system);

	const handleSubmit = () => console.log("game added");

	return (
		<ContentWrapper>
			<Form layout="inline" onSubmit={handleSubmit}>
				<Form.Item>
					<TextInput type="text" value={text} onChange={handleTitleChange} />
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
