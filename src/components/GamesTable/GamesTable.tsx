import React, { Component } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Input, Button, Tag, Checkbox, Spin, Tooltip, Icon } from "antd";
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

interface State {
	games: Array<Game>;
	filterData: Array<Game>;
	searchText: string;
	loading: boolean;
	count: number;
}

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class GamesTable extends Component<Props, State> {
	state = {
		games: [],
		filterData: [],
		searchText: "",
		loading: false,
		count: 0
	};

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.selectedSystem === "none") {
			this.setState({
				games: [],
				filterData: [],
				loading: false,
				count: 0
			});
		} else {
			this.setState({
				loading: true
			});

			const gamesRef = firebase.database().ref(`games/${nextProps.selectedSystem}`);
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
				switch (nextProps.filterType) {
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

				this.setState({
					games: games,
					filterData: games,
					loading: false,
					count: games.length
				});
			});
		}
	}

	playingStateChange = (e: any, key: string) => {
		const { selectedSystem } = this.props;
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

	finishedStateChange = (e: any, key: string) => {
		const { selectedSystem } = this.props;
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

	getColumnSearchProps = (dataIndex: string) => ({
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
					onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: "block" }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
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
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	});

	handleSearch = (selectedKeys: any, confirm: () => void) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = (clearFilters: any) => {
		clearFilters();
		this.setState({ searchText: "" });
	};

	render() {
		const columns = [
			{
				title: "Game",
				dataIndex: "title",
				key: "title",
				width: "35%",
				...this.getColumnSearchProps("title"),
				render: (title: string, row: any) => <PlayingTime gameId={row.key} title={title} />
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
					<Checkbox checked={checked} onChange={e => this.playingStateChange(e, row.key)} />
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
					<Checkbox checked={checked} onChange={e => this.finishedStateChange(e, row.key)} />
				)
			},
			{
				title: "Edit / Delete",
				dataIndex: "edit",
				key: "edit",
				width: "20%",
				render: (e: any, row: any) => {
					const { selectedSystem } = this.props;
					const url = `games/${selectedSystem}/${row.key}`;
					return (
						<SC.DeleteEdit>
							<AddGame system={selectedSystem} editMode gameID={row.key} />
							<DeleteDialog url={url} />
						</SC.DeleteEdit>
					);
				}
			}
		];

		const { games, count, loading } = this.state;

		return (
			<React.Fragment>
				<SC.SimpleBadge count={count} />
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
	}
}

let component = GamesTable;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
