import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button, Tag, Checkbox, Spin, Tooltip, Icon } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import Highlighter from "react-highlight-words";

import DeleteDialog from "./DeleteDialog";
import EditGame from "../AddGame/AddGame";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

import * as SC from "./StyledComponents";

const PLAYING = "playing";
const FINISHED = "finished";

class GamesTable extends Component {
	state = {
		games: [],
		filterData: [],
		searchText: "",
		loading: false,
		count: 0
	};

	componentWillReceiveProps(nextProps) {
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
				let games = [];

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

	onInputChange = e => {
		this.setState({ searchText: e.target.value });
		this.onSearch();
	};

	playingStateChange = (e, key) => {
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
					console.log("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, PLAYING, game);
				}
			}
		);
	};

	finishedStateChange = (e, key) => {
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
					console.log("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, FINISHED, game);
				}
			}
		);
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
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
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	});

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
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
				...this.getColumnSearchProps("title")
			},
			{
				title: "Region",
				dataIndex: "region",
				key: "region",
				width: "10%",
				// colors -> https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c
				render: e => (
					<Tag color={e === "PAL" ? "#FF9F1C" : e === "JAP" ? "#2EC4B6" : "#E71D36"}>{e}</Tag>
				)
			},
			{
				title: "Genre",
				dataIndex: "genre",
				key: "genre",
				width: "25%",
				render: e => {
					let tags = e.split(",");
					return (
						<div>
							{tags.map((tag, i) => (
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
				render: (e, row) => (
					<Checkbox checked={e} onChange={e => this.playingStateChange(e, row.key)} />
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
				render: (e, row) => (
					<Checkbox checked={e} onChange={e => this.finishedStateChange(e, row.key)} />
				)
			},
			{
				title: "Edit / Delete",
				dataIndex: "edit",
				key: "edit",
				width: "20%",
				render: (e, row) => {
					return (
						<SC.DeleteEdit>
							<EditGame system={this.props.selectedSystem} editMode gameID={row.key} />
							<DeleteDialog system={this.props.selectedSystem} gameID={row.key} />
						</SC.DeleteEdit>
					);
				}
			}
		];

		return (
			<React.Fragment>
				<SC.SimpleBadge count={this.state.count} />
				{this.state.loading ? (
					<SC.LoadingSpinner>
						<Spin tip="Collecting Games..." />
					</SC.LoadingSpinner>
				) : (
					<SC.TableContainer
						columns={columns}
						dataSource={this.state.games}
						pagination={false}
						scroll={{ y: "65vh" }}
					/>
				)}
			</React.Fragment>
		);
	}
}

let component = GamesTable;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
