import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";

import { WishlistItem } from "../../types/firebase";

import Head from "../Head/Head";
import Footer from "../Footer/Footer";

import WishlistInputForm from "./WishlistInputForm";
import TableColumns from "./TableColumns";
import { DataList } from "./StyledComponents";

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
			<DataList dataSource={games} columns={TableColumns} />;
			<Footer />
		</React.Fragment>
	);
};

export default Wishlist;
