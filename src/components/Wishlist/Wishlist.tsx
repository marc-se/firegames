// @ts-nocheck
import React, { useState, useEffect, Fragment } from "react";
import firebase from "firebase/app";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
import "firebase/database";

import { WishlistItem } from "../../types/firebase";

import Head from "../Head/Head";
import Footer from "../Footer/Footer";

import WishlistInputForm from "./WishlistInputForm";
import TableColumns from "./TableColumns";
import { DataList, LoadingWrapper, ContentWrapper, DataWrapper, Count } from "./StyledComponents";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Wishlist = () => {
	const [games, setGames] = useState([] as Array<WishlistItem>);
	const [gamesCount, setGamesCount] = useState(0);
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
					setGamesCount(items.length);
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
		<Fragment>
			<Head />
			<ContentWrapper>
				{loading ? (
					<LoadingWrapper>
						<Spin indicator={loadingIcon} />
					</LoadingWrapper>
				) : (
						<Fragment>
							<WishlistInputForm />
							<DataWrapper>
								<Count count={gamesCount} overflowCount={999} />
								<DataList dataSource={games} columns={TableColumns} pagination={false} />
							</DataWrapper>
						</Fragment>
					)}
			</ContentWrapper>
			<Footer />
		</Fragment>
	);
};

export default Wishlist;
