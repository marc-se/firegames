import React from "react";

import Head from "../Head/Head";
import Footer from "../Footer/Footer";

import WishlistInputForm from "./WishlistInputForm";
import { DataList } from "./StyledComponents";

const data = [
	"Tales of Hearts R",
	"Giga Wing 2",
	"The Witcher 2: Assassins of Kings",
	"Karous",
	"Assassin's Creed Origins",
	"Kingdom Hearts II"
];

const Wishlist = () => {
	return (
		<React.Fragment>
			<Head />
			<WishlistInputForm />
			<DataList
				header={<div>Wishlist</div>}
				bordered
				dataSource={data}
				renderItem={(item: string) => <DataList.Item>{item}</DataList.Item>}
			/>
			<Footer />
		</React.Fragment>
	);
};

export default Wishlist;
