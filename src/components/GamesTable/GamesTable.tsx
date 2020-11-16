// @ts-nocheck
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Tag, Checkbox, Spin, Tooltip } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import Highlighter from "react-highlight-words";

import AddGame from "../AddGame/AddGame";
import PlayingTime from "../PlayingTime/PlayingTime";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";
import { Game } from "../../types/firebase";

import DeleteDialog from "../DeleteDialog/DeleteDialog";
import * as SC from "./StyledComponents";

const PLAYING = "playing";
const FINISHED = "finished";

interface Props {
	selectedSystem?: string;
	filterType?: string;
}

interface State { }

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const GamesTable = (props: Props) => {
	const [games, setGames] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (props.selectedSystem === "none") {
			setGames([]);
			setLoading(false);
			setCount(0);
		} else {
			setLoading(true);

			const gamesRef = firebase.database().ref(`games/${props.selectedSystem}`);
			gamesRef.on("value", snap => {
				let data = snap.val();
				let games: Array<Game> = [];

				Object.keys(data).forEach(game => {
					// add key to object
					data[game].key = game;
					// push object to games list
					games.push(data[game]);
				});

				/* eslint-disable */
				switch (props.filterType) {
					case "PLAYING_FILTER":
						games = games.filter(game => game.playing === true);
						break;
					case "FINISHED_FILTER":
						games = games.filter(game => game.finished === true);
						break;
					case "UNTOUCHED_FILTER":
						games = games.filter(game => !game.playing && !game.finished);
						break;
				}
				/* eslint-enable */

				// sort games alphabetically after filtering (ascending)
				games.sort((a, b) => {
					let gameA = a.title.toUpperCase();
					let gameB = b.title.toUpperCase();
					return gameA < gameB ? -1 : gameA > gameB ? 1 : 0;
				});

				setGames(games);
				setLoading(false);
				setCount(games.length);
			});
		}
	}, [props]);

	const playingStateChange = (e: any, key: string) => {
		const { selectedSystem } = props;
		const updateFile = firebase.database().ref(`games/${selectedSystem}/${key}`);
		let game = {};

		updateFile.once("value", snap => (game = snap.val()));

		updateFile.update(
			{
				playing: e.target.checked
			},
			e => {
				if (e) {
					console.error("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, PLAYING, game);
				}
			}
		);
	};

	const finishedStateChange = (e: any, key: string) => {
		const { selectedSystem } = props;
		const updateFile = firebase.database().ref(`games/${selectedSystem}/${key}`);
		let game = {};

		updateFile.once("value", snap => (game = snap.val()));

		updateFile.update(
			{
				finished: e.target.checked
			},
			e => {
				if (e) {
					console.error("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, FINISHED, game);
				}
			}
		);
	};

	const getColumnSearchProps = (dataIndex: string) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
		}: {
			setSelectedKeys: any;
			selectedKeys: any;
			confirm: any;
			clearFilters: any;
		}) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys, confirm)}
						style={{ width: 188, marginBottom: 8, display: "block" }}
					/>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Search
				</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reset
				</Button>
				</div>
			),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value: string, record: Array<string>) =>
			// @ts-ignore
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		render: (text: string) => (
			<Highlighter
				highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
				searchWords={[searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	});

	const handleSearch = (selectedKeys: any, confirm: () => void) => {
		confirm();
		setSearchText(selectedKeys[0]);
	};

	const handleReset = (clearFilters: any) => {
		clearFilters();
		setSearchText("");
	};

	const columns = [
		{
			title: "Game",
			dataIndex: "title",
			key: "title",
			width: "35%",
			...getColumnSearchProps("title"),
			render: (title: string, row: any) => (
				<PlayingTime gameId={row.key} title={title} time={row.playtime || 0} />
			)
		},
		{
			title: "Region",
			dataIndex: "region",
			key: "region",
			width: "10%",
			// colors -> https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c
			render: (region: string) => (
				<Tag color={region === "PAL" ? "#FF9F1C" : region === "JAP" ? "#2EC4B6" : "#E71D36"}>
					{region}
				</Tag>
			)
		},
		{
			title: "Genre",
			dataIndex: "genre",
			key: "genre",
			width: "25%",
			render: (genres: string) => {
				const tags = genres.split(",");
				return (
					<div>
						{tags.map((tag: string, i) => (
							<Tag key={i}>{tag}</Tag>
						))}
					</div>
				);
			}
		},
		{
			title: (
				<Tooltip title="playing">
					<span role="img" aria-label="status: playing">
						🕹
					</span>
				</Tooltip>
			),
			dataIndex: "playing",
			key: "playing",
			width: "5%",
			render: (checked: boolean, row: any) => (
				<Checkbox checked={checked} onChange={e => playingStateChange(e, row.key)} />
			)
		},
		{
			title: (
				<Tooltip title="finished">
					<span role="img" aria-label="status: finished">
						✅
					</span>
				</Tooltip>
			),
			dataIndex: "finished",
			key: "finished",
			width: "5%",
			render: (checked: boolean, row: any) => (
				<Checkbox checked={checked} onChange={e => finishedStateChange(e, row.key)} />
			)
		},
		{
			title: "Edit / Delete",
			dataIndex: "edit",
			key: "edit",
			width: "20%",
			render: (e: any, row: any) => {
				const { selectedSystem } = props;
				const url = `games/${selectedSystem}/${row.key}`;
				return (
					<SC.DeleteEdit>
						<AddGame system={selectedSystem} editMode gameID={row.key} />
						<DeleteDialog url={url} system={selectedSystem} />
					</SC.DeleteEdit>
				);
			}
		}
	];

	return (
		<React.Fragment>
			<SC.SimpleBadge count={count} overflowCount={999} />
			{loading ? (
				<SC.LoadingSpinner>
					<Spin indicator={loadingIcon} />
				</SC.LoadingSpinner>
			) : (
					<SC.TableContainer
						columns={columns}
						dataSource={games}
						pagination={false}
						scroll={{ y: "65vh" }}
					/>
				)}
		</React.Fragment>
	);
};

let component = GamesTable;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
