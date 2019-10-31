import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { Spin, Icon } from "antd";
import "firebase/database";

import { WishlistItem } from "../../types/firebase";

import Head from "../Head/Head";
import Footer from "../Footer/Footer";

import WishlistInputForm from "./WishlistInputForm";
import TableColumns from "./TableColumns";
import { DataList, LoadingWrapper, ContentWrapper } from "./StyledComponents";

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Wishlist = () => {
	const [games, setGames] = useState([] as Array<WishlistItem>);
	const [loading, setLoading] = useState(true);

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
					setLoading(false);
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
			<ContentWrapper>
				<WishlistInputForm />
				{loading ? (
					<LoadingWrapper>
						<Spin indicator={loadingIcon} />
					</LoadingWrapper>
				) : (
					<DataList dataSource={games} columns={TableColumns} pagination={false} />
				)}
			</ContentWrapper>
			<Footer />
		</React.Fragment>
	);
};

export default Wishlist;
