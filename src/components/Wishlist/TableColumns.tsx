import React from "react";
import { Tag, Checkbox } from "antd";

function handleChange(e: any, key: string) {
	console.log(e, key);
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
