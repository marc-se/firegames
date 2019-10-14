import React, { Fragment } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Tag, Checkbox } from "antd";

import AddGame from "../AddGame/AddGame";
import { BtnWrapper } from "./StyledComponents";

async function handleChange(e: any, key: string) {
	try {
		const updateFile = await firebase.database().ref(`wishlist/${key}`);
		await updateFile.update({
			purchased: e.target.checked
		});
	} catch (error) {
		console.error("update failed", error);
	}
}

const TableColumns = [
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
		width: "40%"
	},
	{
		title: "System",
		dataIndex: "system",
		key: "system",
		width: "15%"
	},
	{
		title: "Region",
		dataIndex: "region",
		key: "region",
		width: "10%",
		render: (region: string) => (
			<Tag color={region === "PAL" ? "#FF9F1C" : region === "JAP" ? "#2EC4B6" : "#E71D36"}>
				{region}
			</Tag>
		)
	},
	{
		title: "Purchased",
		dataIndex: "purchased",
		key: "purchased",
		width: "35%",
		render: (checked: boolean, row: any) => (
			<Fragment>
				<Checkbox checked={checked} onChange={e => handleChange(e, row.key)} />
				{checked && (
					<BtnWrapper>
						<AddGame size="small" buttonTitle="add to collection" />
					</BtnWrapper>
				)}
			</Fragment>
		)
	}
];

export default TableColumns;
