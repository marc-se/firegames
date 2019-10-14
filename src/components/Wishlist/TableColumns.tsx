import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Tag, Checkbox } from "antd";

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
		key: "title"
	},
	{
		title: "System",
		dataIndex: "system",
		key: "system"
	},
	{
		title: "Region",
		dataIndex: "region",
		key: "region",
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
		render: (checked: boolean, row: any) => (
			<Checkbox checked={checked} onChange={e => handleChange(e, row.key)} />
		)
	}
];

export default TableColumns;
