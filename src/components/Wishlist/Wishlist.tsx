import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";

import { WishlistItem } from "../../types/firebase";

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
	const [games, setGames] = useState([] as Array<WishlistItem>);

	async function fetchItems() {
		try {
			const dataRef = await firebase.database().ref("wishlist");
			await dataRef.on("value", snap => {
				let data = snap.val();
				if (data) {
					let items: Array<WishlistItem> = [];

					Object.keys(data).forEach(item => {
						data[item].key = item;
						items.push(data[item]);
					});

					setGames(items);
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchItems();
	}, []);

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
